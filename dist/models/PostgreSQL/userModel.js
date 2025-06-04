var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../../db/postgres.js";
const create = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, hashedPassword, role }) {
    try {
        yield pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id", [name, email, hashedPassword, role || "user"]);
    }
    catch (err) {
        throw err;
    }
});
const check = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        return result;
    }
    catch (err) {
        throw err;
    }
});
export default { create, check };
