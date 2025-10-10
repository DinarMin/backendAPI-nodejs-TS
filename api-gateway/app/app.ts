import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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

const USER_SERVICE_URL: string = `http://localhost:${process.env.PORTUSERSERVICE}`;

app.post("/registration", async (req, res) => {
  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/user/registration`,
      req.body,
      {
        validateStatus: (status) => status < 500,
      }
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

app.post("/authorization", async (req, res) => {
  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/user/authorization`,
      req.body,
      {
        validateStatus: (status) => status < 500,
      }
    );

    const token = response.data.token;

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(response.status).json({ message: "Login successful" });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});
