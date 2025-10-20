import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { routes } from "../routes/routes.js";
import cookieParser from "cookie-parser";
import cookie from "cookie";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
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
app.use(cookieParser());

app.use(async (req, res) => {
  const tokenRequest = req.cookies?.token;

  const headers = { ...req.headers };
  if (tokenRequest) headers.authorization = tokenRequest;

  const {
    host,
    connection,
    cookie,
    "content-length": _,
    ...safeHeaders
  } = headers;

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
      headers: safeHeaders,
      timeout: 3000,
      validateStatus: (status) => status === 200,
    });

    if (response.data.token) {
      const tokenResponse = response.data.token;

      if (tokenResponse) {
        res.cookie("token", tokenResponse, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(response.status).json(response.data.message);
      }
    }
    if (![200, 201].includes(response.status)) {
      throw new Error();
    }
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      error: error.message || "Internal server error",
    };
    console.error(`${status}: ${data}, ${error}`);
    return res.status(status).json(data);
  }
});
