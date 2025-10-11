import Joi from "joi";
import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from 'express';

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

export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction):void => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    logger.warn(`Validation failed: ${error.details[0].message}`);
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  console.log(" Валидация прошла успешно! ");
  
  next();
};

