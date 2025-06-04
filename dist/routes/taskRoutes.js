import express from "express";
import { createTask, getTasksPag, updateStatus, } from "../controllers/taskController.js";
import { Auth } from "../utils/auth.js";
import { validate, taskSchema } from "../validations/validation.js";
const router = express.Router();
router.get("/", Auth, getTasksPag);
router.post("/", Auth, validate(taskSchema), createTask);
router.put("/", Auth, updateStatus);
export default router;
