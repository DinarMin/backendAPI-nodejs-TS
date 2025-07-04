var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import emailQueue from "../queues/emailQueue.js";
import logger from "../utils/logger.js";
class TaskService {
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    createTask(title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskModel.createTask(title, userId);
                logger.info(`Task created: ${title} by user ${userId}`);
                return result;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getAllTask(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskModel.getAllTask(userId);
            return result;
        });
    }
    updateStatus(status, taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskModel.updateStatus(status, taskId, userId);
                if (!result) {
                    logger.warn(`Произошла ошибка, задача не найдена в базе данных! userID: ${userId}`);
                    throw new Error("Произошла ошибка, задача не найдена в базе данных!");
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error("Unauthorized");
                }
                yield this.taskModel.deleteTask(taskId, userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTasksPag(userId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageInt = parseInt(page);
            const offset = (pageInt - 1) * limit;
            const tasks = yield this.taskModel.getTasksPag(userId, limit, offset);
            const total = yield this.taskModel.getTotalPag(userId);
            return {
                tasks,
                total: total,
                page: pageInt,
                pages: Math.ceil(total / limit),
            };
        });
    }
}
export default TaskService;
