import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import taskNestRoutes from "../routes/taskRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/users/taskNest", taskNestRoutes);