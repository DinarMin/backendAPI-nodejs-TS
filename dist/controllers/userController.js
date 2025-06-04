var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userService from "../services/userService.js";
const userController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (name) {
        const registerData = {
            name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        };
        try {
            yield userService.register(registerData);
            res.status(200).json({ message: "User registered" });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
            }
        }
    }
    else {
        try {
            const token = yield userService.login(req.body);
            res.status(200).json({ token });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
            }
        }
    }
});
export { userController };
