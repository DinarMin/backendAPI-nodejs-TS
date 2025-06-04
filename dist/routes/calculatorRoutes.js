import express from "express";
import logger from "../utils/logger.js";
const router = express.Router();
router.post("/", (req, res) => {
    const body = req.body;
    const { operation, a, b } = body;
    const validOperations = ["add", "subtract", "multiply", "divide"];
    if (!validOperations.includes(operation)) {
        logger.warn(`Не правильная операция для калькулятора. operation: ${operation}`);
        res.status(400).json({ error: "Invalid operation" });
        return;
    }
    if (typeof a !== "number" || typeof b !== "number") {
        logger.warn("Invalid input types");
        res.status(400).json({ error: "Numbers required" });
        return;
    }
    let result;
    switch (operation) {
        case "add":
            result = a + b;
            break;
        case "subtract":
            result = a - b;
            break;
        case "multiply":
            result = a * b;
            break;
        case "divide":
            if (b === 0) {
                logger.warn("На ноль делить нельзя!!!");
                res.status(400).json({ error: "На ноль делить нельзя!!!" });
                return;
            }
            result = a / b;
            break;
    }
    logger.info(`Calculated ${operation}(${a}, ${b}) = ${result}`);
    res.status(200).json({ result });
});
export default router;
