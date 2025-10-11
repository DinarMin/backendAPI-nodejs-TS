import express from "express";
import { UserController } from "../controllers/userController.js";
import UserService from "../services/userService.js";
import UserRepository from "../models/userModel.js";
import { validate, registerSchema, loginSchema } from "../validations/validation.js";

const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

const router = express.Router();

router.post('/registration', validate(registerSchema), userController.registerUser);
router.post('/authorization', validate(loginSchema), userController.authorizationUser);

export default router;

