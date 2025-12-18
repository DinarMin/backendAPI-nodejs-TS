import express from "express";
import { UserController } from "../controllers/userController.js";
import UserService from "../services/userService.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../validations/validation.js";
import { UserRepository } from "../models/userModel.js";
import { JwtService, BcryptService } from "../services/authService.js";

const userRepository = new UserRepository();
const encryptionService = new BcryptService();
const tokenService = new JwtService();


const userService = new UserService(userRepository, encryptionService, tokenService);
const userController = new UserController(userService);

const router = express.Router();

router.post(
  "/registration",
  validate(registerSchema),
  userController.registerUser
);
router.post(
  "/authorization",
  validate(loginSchema),
  userController.authorizationUser
);

export default router;
