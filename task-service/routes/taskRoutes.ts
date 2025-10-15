import express from "express";
import { validate, taskSchema } from "../validations/validation.js";
import TaskRepository from "../models/taskModel.js";
import TaskService from "../services/taskService.js";
import TaskController from "../controllers/taskController.js";


const taskService = new TaskService(new TaskRepository());
const taskController = new TaskController(taskService);

const router = express.Router();

router.get("/", taskController.getAllTask);
router.post("/", validate(taskSchema), taskController.createTask);
router.put("/:id", taskController.updateStatus);
router.delete("/:id", taskController.deleteTask);

export default router;
