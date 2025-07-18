import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool();

pool.on("connect", () => {
  console.log("Успешный запрос к базам PostgreSQL");
});

pool.on("error", () => {
  console.log("Ошибка подключение к базам PostgreSQL");
});

export default pool; 
