var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../../db/postgres.js";
class TaskRepository {
    createTask(title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *", [title, userId]);
                return result.rows[0];
            }
            catch (err) {
                console.error("Error in createTask:", err);
                throw err;
            }
        });
    }
    getAllTask(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool.query("SELECT * FROM tasks WHERE user_id=$1", [
                userId,
            ]);
            return result.rows;
        });
    }
    updateStatus(status, taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool.query("UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *", [status, taskId, userId]);
            return result.rows[0];
        });
    }
    deleteTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *", [id, userId]);
            return result.rows[0];
        });
    }
    getTasksPag(userId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3", [userId, limit, offset]);
            return res.rows;
        });
    }
    getTotalPag(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield pool.query("SELECT COUNT(*) FROM tasks WHERE user_id = $1", [userId]);
            return res.rows[0].count;
        });
    }
}
export default TaskRepository;
