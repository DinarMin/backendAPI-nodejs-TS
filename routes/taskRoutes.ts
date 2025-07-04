import express from "express";
import { Auth } from "../utils/auth.js";
import { validate, taskSchema } from "../validations/validation.js";
import TaskRepository from "../models/PostgreSQL/taskModel.js";
import TaskService from "../services/taskService.js";
import { TaskController } from "../controllers/taskController.js";

const taskService = new TaskService(new TaskRepository());
const taskController = new TaskController(taskService);

const router = express.Router();

router.get("/all", Auth, taskController.getAllTask);
router.post("/create", Auth, validate(taskSchema), taskController.createTask);
router.put("/update", Auth, taskController.updateStatus);
router.delete("/delete", Auth, taskController.deleteTask);

export default router;
