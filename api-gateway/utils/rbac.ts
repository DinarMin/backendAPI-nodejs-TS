import logger from "./logger.js";
import { Request, Response, NextFunction } from "express";
// import User from "../models/Mongo/User.js";
import pool from "../db/postgres.js";

type Permission = "users:read" | "tasks:manage" | "tasks:create" | "tasks:read";

type PermissionsOptions = {
  admin: Permission[];
  user: Permission[];
};

type AuthRequest = Request & { userId?: string };

const permissions: PermissionsOptions = {
  admin: ["users:read", "tasks:manage"],
  user: ["tasks:create", "tasks:read"],
};

const checkPermissions =
  (permission: Permission) =>
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.userId,
    ]);
    const user = result.rows[0];
    if (!user) {
      logger.error(`User nod found: ${req.userId}`);
      res.status(404).json({ error: "User not found" });
      return;
    }
    const userPermissions =
      permissions[user.role as keyof PermissionsOptions] || [];
    if (!userPermissions.includes(permission)) {
      logger.warn(
        `Access denied for ${req.userId}: required ${permission}, role: ${user.role}`
      );
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    logger.info(`Permission check passed for ${req.userId}: ${permission}`);
    next();
  };

export default checkPermissions;
