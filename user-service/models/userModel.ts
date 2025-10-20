import { BlobOptions } from "buffer";
import pool from "../db/postgres.js";

type CreateUserParams = {
  name: string;
  email: string;
  hashedPassword: string;
  role?: string;
};

export type CheckUserParams = {
  id: string;
  email: string;
  password: string;
};

class UserRepository {
  async createUser({
    name,
    email,
    hashedPassword,
    role,
  }: CreateUserParams): Promise<void> {
    try {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        [name, email, hashedPassword, role || "user"]
      );
    } catch (err: any) {
      if (err.code === "23505") {
        throw new Error("Не правильный логин или пароль!");
      }
      throw err;
    }
  }

  async checkUser(email: string): Promise<CheckUserParams | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = result.rows[0];
      return user || null;
    } catch (err) {
      throw err;
    }
  }
}

export default UserRepository;
