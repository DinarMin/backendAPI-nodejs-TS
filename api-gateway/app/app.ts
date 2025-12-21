import express from "express";
import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IncomingMessage, ServerResponse } from "http";
import { routes } from "../routes/routes.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Слишком много запросов!",
    });
  },
});

export const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use(limiter);

Object.entries(routes).forEach(([route, target]: [string, string]) => {
  console.log(route, target);
  const proxyOptions = {
    target,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: (path: any, req: Request) => {
      return req.originalUrl;
    },
    on: {
      proxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
        let chunks: Buffer[] = [];
        proxyRes.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });
        proxyRes.on("end", () => {
          const rawBody: string = Buffer.concat(chunks).toString();
          try {
            const parseBody = JSON.parse(rawBody);
            if (parseBody.token) {
              res.cookie("token", parseBody.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
              res.end(parseBody.message);
            }
            res.end(parseBody);
          } catch (error) {
            res.status(proxyRes.statusCode || 500).end(rawBody);
          }
        });
      },
      error: (err: Error, req: Request, res: any) => {
        res.status(500).json({ message: "Proxy Error", error: err.message });
      },
    },
  };

  app.use(route, createProxyMiddleware(proxyOptions));
});

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Необработанная ошибка:", err);
  res.status(500).json({ error: err.message });
});
