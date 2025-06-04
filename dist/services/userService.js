var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { registerSchema, loginSchema } from "../validations/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, role } = userData;
            try {
                const { error } = registerSchema.validate({ name, email, password });
                if (error) {
                    logger.warn(`Ошибка валидации: ${error.details}`);
                    throw new Error(`error: ${error.details[0].message}`);
                }
                const hashedPassword = yield bcrypt.hash(password, 10);
                yield this.userModel.createUser({ name, email, hashedPassword, role });
                logger.info(`Регистрация прошла успешно! email: ${email}`);
            }
            catch (error) {
                throw error;
            }
        });
    }
    authorizationUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userData;
            try {
                const { error } = loginSchema.validate({ email, password });
                if (error) {
                    throw new Error(`error: ${error.details[0].message}`);
                }
                const user = yield this.userModel.checkUser(email);
                if (!user || !(yield bcrypt.compare(password, user.password))) {
                    throw new Error("Неверный логин или пароль!");
                }
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "60d",
                });
                logger.info(`Авторизация прошла успешно! email: ${email}`);
                return token;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
export default UserService;
