import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { routes } from "../routes/routes.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Слишком много запросов!",
    });
  },
});

export const app = express();

dotenv.config();
app.use(cors());
app.use(helmet());
app.use("/", limiter);
app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});

app.use(async (req, res) => {
  try {
    const baseUrl = Object.entries(routes).find(([prefix]) =>
      req.path.startsWith(prefix)
    )?.[1];

    if (!baseUrl) {
      return res.status(404).json({ message: "Unknown routes" });
    }

    const targetUrl = `${baseUrl}${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      timeout: 3000,
      validateStatus: (status) => status === 200,
    });

    if (response.data.token) {
      const token = await response.data.token;

      if (token) {
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
    }
    if (response.status !== 200) {
      throw new Error;
    }
    res.status(response.status).json({ message: "Вы успешно авторизовались" });
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status).json(error.response.data);
  }
});
