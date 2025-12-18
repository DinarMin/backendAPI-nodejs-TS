import logger from "../utils/logger.js";
import { UserRepository, CheckUserParams } from "../models/userModel.js";
import { IEncryptionService } from "../interfaces/IEncryptionService.js";
import { ITokenService } from "../interfaces/ITokenService.js";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type AuthUserRequest = {
  email: string;
  password: string;
};

const jwtSecret = process.env.JWT_SECRET;
class UserService implements UserServiceInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly tokenService: ITokenService
  ) {}

  async registerUser(userData: CreateUserRequest): Promise<void> {
    const { name, email, password} = userData;
    try {
      const hashedPassword = await this.encryptionService.hash(password, 10);
      await this.userRepository.createUser({
        name,
        email,
        hashedPassword,
      });
      logger.info(`Регистрация прошла успешно! email: ${email}`);
    } catch (error) {
      throw error;
    }
  }

  async authorizationUser(userData: AuthUserRequest): Promise<string> {
    const { email, password } = userData;
    try {
      const user: CheckUserParams | null = await this.userRepository.checkUser(
        email
      );

      if (
        !user ||
        !(await this.encryptionService.compare(password, user.password))
      ) {
        throw new Error("Неверный логин или пароль!");
      }

      const token = this.tokenService.generatedToken({ id: user.id }, "60d");
      logger.info(`Авторизация прошла успешно! email: ${email}`);
      return token;
    } catch (error) {
      throw error;
    }
  }
}
export interface UserServiceInterface {
  registerUser(userData: CreateUserRequest): Promise<void>;
  authorizationUser(userData: AuthUserRequest): Promise<string>;
}

export default UserService;
