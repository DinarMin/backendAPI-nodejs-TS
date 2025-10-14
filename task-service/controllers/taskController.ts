import { TaskServiceInterface } from "../services/taskService.js";
import logger from "../utils/logger.js";
import { Request, Response } from "express";

class TaskController {
  private taskService: TaskServiceInterface;

  constructor(taskService: TaskServiceInterface) {
    this.taskService = taskService;
  }

  createTask = async (req: Request, res: Response) => {
    try {
      const { title } = req.body;

      if (!req.body.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const result = await this.taskService.createTask(title, req.body.userId);
      logger.info(`Задача успешно добавлена! userid: ${req.body.userId} ${result}`);
      res.status(201).json({ message: "Задача успешно добавлена", result });
    } catch (err: unknown) {
      console.error("Ошибка при создании задачи:", err);
      if (err instanceof Error) {
        logger.warn(
          `Не удалось создать задачу. userId: ${req.body.userId}, ${err.message}`
        );
      }
      res.status(500).json({
        error: "Ошибка сервера. Не удалось создать задачу. Попробуйте снова.",
      });
    }
  };

  getAllTask = async (req: Request, res: Response) => {
    try {
      if (!req.body.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const result: { [key: string]: any } = await this.taskService.getAllTask(
        req.body.userId
      );
      res.status(200).json(result);
    } catch (error) {
      logger.warn(`Не удалось получить список задач! userid: ${req.body.userId}`);
      res.status(500).json({ error: "Не удалось получить список задач." });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      if (!req.body.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const userId = req.body.userId;
      const { status, taskId } = req.body;
      const result = await this.taskService.updateStatus(
        status,
        taskId,
        userId
      );
      logger.info(
        `Статус задачи успешно обновлена. taskID: ${req.body.taskId}`
      );
      res.status(200).json({ task: result });
    } catch (error) {
      res
        .status(404)
        .json({ error: "Произошла ошибка, повторите попытку еще раз." });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const { userId } = req.body;
      await this.taskService.deleteTask(taskId, userId);
      res.sendStatus(204);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        res.status(401).json({ message: error });
      }
      console.log(error);
      res.status(404).json({ message: error });
    }
  };

  getTasksPag = async (req: Request, res: Response) => {
    try {
      if (!req.body.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const rawPage = req.query.page;
      const rawLimit = req.query.limit;

      const page = typeof rawPage === "string" ? parseInt(rawPage, 10) : 1;
      const limit = "10";

      const userId= req.body.userId;
      const result = await this.taskService.getTasksPag(userId, page, limit);
      logger.info(`Запрос задач успешно прошла. user ${userId}`);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  };
}

export default TaskController;
