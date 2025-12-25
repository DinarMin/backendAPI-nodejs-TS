import { prisma } from "../db/prisma.js";

export type Task = {
  id: string;
  title: string;
  status: string;
  user_id: string;
};

class TaskRepository {
  async createTask(title: string, userId: string): Promise<void> {
    try {
      await prisma.tasks.create({
        data: {
          title: title,
          userId: String(userId)
        },
      });
      await prisma.$disconnect();
      return;
    } catch (err) {
      console.error("Error in createTask:", err);
      await prisma.$disconnect();
      throw err;
    }
  }

  async getAllTask(userId: string): Promise<any> {
    try {
      const result = await prisma.tasks.findMany({
        where: {
          userId,
        },
      });
      await prisma.$disconnect();
      return result;
    } catch (err) {
      console.error("Error in getAllTask:", err);
      throw err;
    }
  }

  async updateStatus(
    status: boolean,
    taskId: string,
    userId: string
  ): Promise<any> {
    try {
      const result = await prisma.tasks.update({
        where: {
          id: Number(taskId),
          userId,
        },
        data: { status },
      });
      await prisma.$disconnect();
      return result;
    } catch (err) {
      console.error("Error in updateStatus:", err);
      throw err;
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      await prisma.tasks.delete({
        where: {
          id: Number(taskId),
          userId,
        },
      });
      await prisma.$disconnect();
    } catch (err) {
      console.error("Error in deleteTask:", err);
      throw err;
    }
  }
}

export default TaskRepository;
