import dotenv from "dotenv";

dotenv.config();

export const routes = {
  "/users": `${process.env.USERSERVICEURL}`,
  "/taskNest": `${process.env.TASKNESTSERVICEURL}`,
};
