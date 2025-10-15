import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import taskNestRoutes from "../routes/taskRoutes.js";
import { Auth } from "../utils/auth.js";

export const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/taskNest", Auth, taskNestRoutes);
