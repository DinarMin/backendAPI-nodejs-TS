var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import taskService from "../services/taskService.js";
import logger from "../utils/logger.js";
export const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const result = yield taskService.createTask(title, req.userId);
        logger.info(`Задача успешно добавлена! userid: ${req.userId} ${result}`);
        res.status(201).json({ message: "Задача успешно добавлена", result });
    }
    catch (err) {
        console.error("Ошибка при создании задачи:", err);
        if (err instanceof Error) {
            logger.warn(`Не удалось создать задачу. userId: ${req.userId}, ${err.message}`);
        }
        res.status(500).json({
            error: "Ошибка сервера. Не удалось создать задачу. Попробуйте снова.",
        });
    }
});
export const getAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const result = yield taskService.getAllTask(req.userId);
        res.json(result.rows);
    }
    catch (error) {
        console.log(error);
        logger.warn(`Не удалось получить список задач! userid: ${req.userId}`);
        res.status(500).json({ error: "Не удалось получить список задач." });
    }
});
export const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const result = yield taskService.updateStatus(req.body.userId);
        logger.info(`Статус задачи успешно обновлена. taskID: ${req.body.taskId}`);
        res.status(200).json({ task: result });
    }
    catch (error) {
        console.log(error);
        res
            .status(404)
            .json({ error: "Произошла ошибка, повторите попытку еще раз." });
    }
});
export const getTasksPag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const rawPage = req.query.page;
        const rawLimit = req.query.limit;
        const page = typeof rawPage === "string" ? parseInt(rawPage, 10) : 1;
        const limit = typeof rawLimit === "string" ? parseInt(rawLimit, 10) : 10;
        const userId = req.userId;
        const result = yield taskService.getTasksPag(userId, String(page), limit);
        logger.info(`Запрос задач успешно прошла. user ${userId}`);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(error.message);
        }
    }
});
