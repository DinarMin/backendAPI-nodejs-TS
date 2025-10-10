import dotenv from "dotenv";
import { app } from "./app/app.js";

dotenv.config();

const PORTApigateway: number = Number(process.env.PORTAPIGATEWAY || 3000);

if (isNaN(PORTApigateway)) {
  throw new Error("Порт должен быть числом!");
}

const server = app.listen(PORTApigateway, () => {
  console.log(`Входной сервер успешно запущен на порту ${PORTApigateway}`);
});

server.on("error", (err: Error) => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `Порт: ${PORTApigateway} уже занят, используйте другой, например ${
        PORTApigateway + 5
      }`
    );
  } else {
    console.error("Неизвестная ошибка сервера:", err);
  }
  process.exit(1);
});
