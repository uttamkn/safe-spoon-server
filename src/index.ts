import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import inputProcessingRoutes from "./routes/inputProcessing";
import profileRoutes from "./routes/profile";
import { CLIENT_URL, PORT } from "./env";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

const corsOptions = {
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/inputProcessing", inputProcessingRoutes);
app.use("/api/profile", profileRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening on port", PORT);
    });
  })
  .catch((err) => console.error(err));
