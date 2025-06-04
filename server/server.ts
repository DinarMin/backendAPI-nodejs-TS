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

http.createServer(app).listen(3000, () => {
  console.log("Server on port 3000 (HTTP)");
});

runMigrations();
