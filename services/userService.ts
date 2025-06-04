import { registerSchema, loginSchema } from "../validations/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import UserRepository, {
  CheckUserParams,
} from "../models/PostgreSQL/userModel.js";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

type AuthUserRequest = {
  email: string;
  password: string;
};

class UserService {
  constructor(private readonly userModel: UserRepository) {}

  async registerUser(userData: CreateUserRequest): Promise<void> {
    const { name, email, password, role } = userData;
    try {
      const { error } = registerSchema.validate({ name, email, password });
      if (error) {
        logger.warn(`Ошибка валидации: ${error.details}`);
        throw new Error(`error: ${error.details[0].message}`);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.createUser({ name, email, hashedPassword, role });
      logger.info(`Регистрация прошла успешно! email: ${email}`);
    } catch (error) {
      throw error;
    }
  }

  async authorizationUser(userData: AuthUserRequest): Promise<string> {
    const { email, password } = userData;
    try {
      const { error } = loginSchema.validate({ email, password });
      if (error) {
        throw new Error(`error: ${error.details[0].message}`);
      }
      const user: CheckUserParams | null = await this.userModel.checkUser(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Неверный логин или пароль!");
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "60d",
        }
      );
      logger.info(`Авторизация прошла успешно! email: ${email}`);
      return token;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
