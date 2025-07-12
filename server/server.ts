import { app } from "../app/app.js";
import https, { ServerOptions } from "https";
import http from "http";
import fs from "fs";
import { runMigrations } from "../utils/runMigrations.js";

const options: ServerOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("Server on port 443 (HTTPS)");
});

const port: number = Number(process.env.PORT || 3000);

if (isNaN(port)) {
  throw new Error("Порт должен быть числом!");
}

const server = http.createServer(app).listen(port, () => {
  console.log(`Server on port ${port} (HTTP)`);
});

server.on("error", (err: Error): void => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(`Порт: ${port} уже занят!`);
  } else {
    console.error("Неизвестная ошибка сервера:", err);
  }
  process.exit(1);
});

runMigrations();
