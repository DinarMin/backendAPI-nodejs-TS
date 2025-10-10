import { app } from "./app/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORTTaskNest = Number(process.env.PORTTASKNEST || 3002);

const server = app.listen(PORTTaskNest, () => {
  console.log(`Сервис TaskNest успешно запущен на порту ${PORTTaskNest}`);
});

server.on("error", (err: Error) => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `Порт: ${PORTTaskNest} уже занят, используйте другой, например ${
        PORTTaskNest + 12
      }`
    );
  } else {
    console.error("Неизвестная ошибка сервера:", err);
  }
});
