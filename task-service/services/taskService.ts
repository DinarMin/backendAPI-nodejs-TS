// import emailQueue from "../queues/emailQueue.js";
import logger from "../../utils/logger.js";
import TaskRepository, { Task } from "../models/taskModel.js";

type TasksPag = {
  tasks: Task[];
  total: number;
  page: number;
  pages: number;
};

class TaskService {
  constructor(private readonly taskModel: TaskRepository) {}

  async createTask(title: string, userId: string) {
    try {
      const result = await this.taskModel.createTask(title, userId);
      logger.info(`Task created: ${title} by user ${userId}`);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getAllTask(userId: string) {
    const result = await this.taskModel.getAllTask(userId);
    return result;
  }

  async updateStatus(
    status: boolean,
    taskId: string,
    userId: string
  ): Promise<Task | { message: string }> {
    try {
      const result = await this.taskModel.updateStatus(status, taskId, userId);
      if (!result) {
        logger.warn(
          `Произошла ошибка, задача не найдена в базе данных! userID: ${userId}`
        );
        throw new Error("Произошла ошибка, задача не найдена в базе данных!");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(taskId: number, userId: string): Promise<void> {
    try {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      await this.taskModel.deleteTask(taskId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getTasksPag(userId: string, limit: number, page: string) {
    const pageInt = parseInt(page);
    const offset = (pageInt - 1) * limit;
    const tasks = await this.taskModel.getTasksPag(userId, limit, offset);
    const total = await this.taskModel.getTotalPag(userId);
    return {
      tasks,
      total: total,
      page: pageInt,
      pages: Math.ceil(total / limit),
    };
  }
}

export interface TaskServiceInterface {
  createTask(title: string, userId: string): Promise<Task>;
  getAllTask(userId: string): Promise<Task[]>;
  updateStatus(status: boolean, taskId: string, userId: string): Promise<any>;
  deleteTask(taskId: string, userId: string): Promise<void>;
  getTasksPag(userId: string, limit: number, page: string): Promise<any>;
}

export default TaskService;
