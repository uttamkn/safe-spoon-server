import express from "express";
import cors from "cors";
import connectDB from "../config/database";
import authRoutes from "../routes/auth";
import inputProcessingRoutes from "../routes/inputProcessing";
import profileRoutes from "../routes/profile";
import { CLIENT_URL, PORT } from "../env";

const app = express();

const corsOptions = {
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/inputProcessing", inputProcessingRoutes);
app.use("/api/profile", profileRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to the database", err);
});

