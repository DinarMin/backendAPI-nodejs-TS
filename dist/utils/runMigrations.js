var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import path from "path";
import pool from "../db/postgres.js";
export const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    const migrationFiles = fs.readdirSync("./migrations").sort();
    for (const file of migrationFiles) {
        const filePath = path.join("./migrations", file);
        const sql = fs.readFileSync(filePath, "utf8");
        try {
            console.log(`Running migration: ${file}`);
            yield pool.query(sql);
            console.log(`Migration ${file} completed`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error executing migration ${file}:`, error.message);
            }
            else {
                console.error(`Error executing migration ${file}:`, error);
            }
        }
    }
});
