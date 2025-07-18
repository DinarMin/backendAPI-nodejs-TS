import pool from "../../user-service/db/postgres.js";

export type Task = {
  id: string;
  title: string;
  status: string;
  user_id: string;
};

class TaskRepository {
  async createTask(title: string, userId: string): Promise<Task> {
    try {
      const result = await pool.query(
        "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
        [title, userId]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Error in createTask:", err);
      throw err;
    }
  }

  async getAllTask(userId: string): Promise<Task[]> {
    try {
      const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [
        userId,
      ]);
      return result.rows;
    } catch (err) {
      console.error("Error in getAllTask:", err);
      throw err;
    }
  }

  async updateStatus(
    status: boolean,
    taskId: string,
    userId: string
  ): Promise<Task> {
    try {
      const result = await pool.query(
        "UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
        [status, taskId, userId]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Error in updateStatus:", err);
      throw err;
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      await pool.query(
        "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *",
        [taskId, userId]
      );
    } catch (err) {
      console.error("Error in deleteTask:", err);
      throw err;
    }
  }

  async getTasksPag(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Task[]> {
    try {
      const res = await pool.query(
        "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
        [userId, limit, offset]
      );
      return res.rows;
    } catch (err) {
      throw err;
    }
  }

  async getTotalPag(userId: string): Promise<number> {
    const res = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [userId]
    );
    return res.rows[0].count;
  }
}

export default TaskRepository;
