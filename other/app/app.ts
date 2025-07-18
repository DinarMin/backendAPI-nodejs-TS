import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { Auth } from "../utils/auth.js";
import { validate, weatherSchema } from "../validations/validation.js";
import logger from "../utils/logger.js";
import checkPermissions from "../utils/rbac.js";
import pool from "../user-service/db/postgres.js";
import userRoutes from "../user-service/routes/userRoutes.js"
import calculatorRoutes from "../routes/calculatorRoutes.js";
import taskNestRoutes from "../task-service/routes/taskRoutes.js";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Слишком много запросов. Попробуйте позже.",
    });
  },
});

export const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/", limiter);

dotenv.config();

/* Обработка регистрации и авторизации */
app.use("/user", userRoutes);

/* Роутер задач */
app.use("/taskNest", taskNestRoutes);

/* Роутер калькулятора */
app.use("/api/calculate", calculatorRoutes as express.Router);

/* Обработка запроса на авторизованного юзера с Middleware */
app.get(
  "/api/protected",
  Auth,
  async (req: Request & { userId?: string }, res: Response): Promise<void> => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        req.userId,
      ]);
      const user = result.rows[0];
      await res.json({
        userID: user.id,
        create: user.created_at,
      });
      console.log("Все хорошо, запрос был доставлен и обработан");
    } catch (err) {
      console.error(err);
    }
  }
);

/* Погода --------------------------------- */

/* Обработка запроса на получение данных о погоде, в теле запроса отправляется название города  */
app.post(
  "/weatherMe",
  Auth,
  validate(weatherSchema),
  async (req: Request, res: Response) => {
    try {
      const city = req.body.city;
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`
      );
      const data = {
        city: response.data.location.name,
        temp: response.data.current.temp_c,
      };
      await pool.query(
        "INSERT INTO weather_history (city, temp, user_id) VALUES ($1, $2, $3) ",
        [data.city, data.temp, req.userId]
      );
      logger.info(
        `Weather fetched: ${data.city}, ${data.temp}°C for user ${req.userId}`
      );
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Weather error: ${err.message}`);
      }
      res.status(500).json({ error: "Weather fetch failed" });
    }
  }
);

/* Получение истории погоды  */
app.get("/weatherMe/history", Auth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT city, temp, created_at FROM weather_history WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    logger.info(
      `Запрос список истории запросов погоды предоставлено! user: ${req.userId}`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.warn(
      `Не удалось получить список истории запросов погоды! user: ${req.userId}`
    );
    res.status(404).json(error);
  }
});

/* Запрос список всех юзеров по админ роли */
app.get(
  "/api/admin/users",
  Auth,
  checkPermissions("users:read"),
  async (req: Request, res: Response) => {
    const users = pool.query("SELECT * FROM users");
    logger.info(`Admin ${req.userId} fetched all users`);
    res.status(200).json(users);
  }
);

/* Подстраховка для выявление ошибок  */

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});