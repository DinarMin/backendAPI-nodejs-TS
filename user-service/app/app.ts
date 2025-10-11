import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import userRoutes from "../routes/userRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});

app.use("/users", userRoutes);
