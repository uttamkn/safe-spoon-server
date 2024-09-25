import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import inputProcessingRoutes from "./routes/inputProcessing";
import profileRoutes from "./routes/profile";
import { PORT } from "./env";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/inputProcessing", inputProcessingRoutes);
app.use("/api/profile", profileRoutes);
