import { Request, Response } from "express";
import { UserServiceInterface } from "../services/userService.js";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export class UserController {
  private userService: UserServiceInterface;

  constructor(userService: UserServiceInterface) {
    this.userService = userService;
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: CreateUserRequest = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      await this.userService.registerUser(registerData);
      res.status(200).json({ message: "User registered" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  };

  authorizationUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token: string = await this.userService.authorizationUser(req.body);
      res.status(200).json({ token, message: "Вы успешно авторизовались" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  };
}
