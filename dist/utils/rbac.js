var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "./logger.js";
// import User from "../models/Mongo/User.js";
import pool from "../db/postgres.js";
const permissions = {
    admin: ["users:read", "tasks:manage"],
    user: ["tasks:create", "tasks:read"],
};
const checkPermissions = (permission) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT role FROM users WHERE id = $1", [
        req.userId,
    ]);
    const user = result.rows[0];
    if (!user) {
        logger.error(`User nod found: ${req.userId}`);
        res.status(404).json({ error: "User not found" });
        return;
    }
    const userPermissions = permissions[user.role] || [];
    if (!userPermissions.includes(permission)) {
        logger.warn(`Access denied for ${req.userId}: required ${permission}, role: ${user.role}`);
        res.status(403).json({ error: "Forbidden" });
        return;
    }
    logger.info(`Permission check passed for ${req.userId}: ${permission}`);
    next();
});
export default checkPermissions;
