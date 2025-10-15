import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

type AuthRequest = Request & { userId?: string };

export const Auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ error: "Error Token" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: Error | null, decoded) => {
      if (
        err ||
        !decoded ||
        typeof decoded !== "object" ||
        !("id" in decoded)
      ) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      const payLoad = decoded as JwtPayload & { id: string };
      req.userId = payLoad.id;
      next();
    }
  );
};
