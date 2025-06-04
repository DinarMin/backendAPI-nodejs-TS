import Joi from "joi";
import logger from "../utils/logger.js";
const name = Joi.string().min(3).max(20).required();
const email = Joi.string().min(3).max(50).required().email().trim();
const password = Joi.string().min(6).required();
const role = Joi.string().valid("user", "admin").optional();
export const registerSchema = Joi.object({
    name: name,
    email: email,
    password: password,
    role: role,
});
export const loginSchema = Joi.object({
    email: email,
    password: password,
});
export const taskSchema = Joi.object({
    title: Joi.string().min(2).required(),
});
export const weatherSchema = Joi.object({
    city: Joi.string().min(3).required(),
});
export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body || req.params);
    const text = req.body.text;
    if (error) {
        logger.warn(`Validation failed: ${error.details[0].message}`);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    console.log(" Валидация прошла успешно! ");
    if (text) {
        logger.info(`Валидация прошла успешно! text: ${text}`);
    }
    next();
};
