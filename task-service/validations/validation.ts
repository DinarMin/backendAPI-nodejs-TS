import Joi from "joi";
import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from 'express';

export const taskSchema = Joi.object({
  title: Joi.string().min(2).required(),
});

export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction):void => {
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

