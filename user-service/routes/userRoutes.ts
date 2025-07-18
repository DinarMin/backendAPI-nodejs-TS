import express from "express";
import { UserController } from "../controllers/userController.js";
import UserService from "../services/userService.js";
import UserRepository from "../models/userModel.js";

const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

const router = express.Router();

router.post('/registration', userController.registerUser);
router.post('/authorization', userController.authorizationUser);

export default router;

