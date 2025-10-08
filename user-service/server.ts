import dotenv from "dotenv";
import { app } from "./app/app.js";
dotenv.config();

const PORTUserService: number = Number(process.env.PORTUSERSERVICE || 3000 + 9);

const server = app.listen(PORTUserService, () => {
  console.log(`Сервис User успешно запущен на порту ${PORTUserService}`);
});

server.on("error", (err: Error) => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `Порт: ${PORTUserService} уже занят, используйте другой порт`
    );
  } else {
    console.error("Неизвестная ошибка сервера:", err);
  }
  process.exit(1);
});
