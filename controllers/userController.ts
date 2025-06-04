import { Request, Response } from "express";
import userService from "../services/userService.js";

type UserRequest = {
  name?: string;
  email: string;
  password: string;
  role?: string;
};

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

const userController = async (req: Request<{}, {}, UserRequest>, res: Response) => {
  const { name } = req.body;
  if (name) {
    const registerData: CreateUserRequest = {
      name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };
    try {
      await userService.register(registerData);
      res.status(200).json({ message: "User registered" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  } else {
    try {
      const token = await userService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      }
    }
  }
};

export { userController };
