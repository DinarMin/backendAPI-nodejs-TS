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
import taskModel from "../models/PostgreSQL/taskModel.js";
const createTask = (title, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield taskModel.createTask(title, userId);
        // await emailQueue.add({
        //   userId: userId,
        //   message: `Task "${title}" created successfully`,
        // });
        logger.info(`Task created: ${title} by user ${userId}`);
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
const getAllTask = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield taskModel.getAllTask(userId);
    return result;
});
const updateStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, taskId } = req.body;
    const result = yield taskModel.updateStatus(status, taskId, req.userId);
    const task = result.rows;
    if (task.length === 0) {
        logger.warn(`Произошла ошибка, задача не найдена в базе данных! userID: ${req.userId}`);
        return {
            message: "Произошла ошибка, задача не найдена в базе данных!",
        };
    }
    return task;
});
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const result = yield taskModel.deleteTask(req.body.id, req.userId);
    if (!result.rows[0]) {
        return {
            message: "Произошла ошибка, задача не найдена в базе данных!",
        };
    }
});
const getTasksPag = (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const pageInt = parseInt(page);
    const offset = (pageInt - 1) * limit;
    const tasks = yield taskModel.getTasksPag(userId, limit, offset);
    const total = yield taskModel.getTotalPag(userId);
    return {
        tasks,
        total: parseInt(total),
        page: pageInt,
        pages: Math.ceil(total / limit),
    };
});
export default {
    createTask,
    getAllTask,
    updateStatus,
    deleteTask,
    getTasksPag,
};
