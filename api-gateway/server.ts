import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";

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

const app = express();
app.use(cors());
app.use(helmet());
app.use("/", limiter);
dotenv.config();

const PORTApigateway: number = Number(process.env.PORTAPIGATEWAY || 3000);

if (isNaN(PORTApigateway)) {
  throw new Error("Порт должен быть числом!");
}

const server = app.listen(PORTApigateway, () => {
  console.log(`Входной сервер успешно запущен на порту ${PORTApigateway}`);
});

server.on("error", (err: Error) => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `Порт: ${PORTApigateway} уже занят, используйте другой, например ${PORTApigateway + 5}`
    );
  } else {
    console.error("Неизвестная ошибка сервера:", err);
  }
  process.exit(1);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});

const USER_SERVICE_URL: string = `http://localhost:${process.env.PORTUSERSERVICE}` ||;


