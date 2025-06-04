var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UserController {
    constructor(userService) {
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const registerData = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role,
                };
                yield this.userService.registerUser(registerData);
                res.status(200).json({ message: "User registered" });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.authorizationUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.userService.authorizationUser(req.body);
                res.status(200).json({ token });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ error: error.message });
                }
            }
        });
        this.userService = userService;
    }
}
