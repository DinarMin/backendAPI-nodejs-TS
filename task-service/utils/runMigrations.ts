import fs from "fs";
import path from "path";
import pool from "../user-service/db/postgres.js";

export const runMigrations = async (): Promise<void> => {
  const migrationFiles: Array<string> = fs.readdirSync("./migrations").sort();

  for (const file of migrationFiles) {
    const filePath: string = path.join("./migrations", file);
    const sql: string = fs.readFileSync(filePath, "utf8");

    try {
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`Migration ${file} completed`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error executing migration ${file}:`, error.message);
      } else {
        console.error(`Error executing migration ${file}:`, error);
      }
    }
  }
};
