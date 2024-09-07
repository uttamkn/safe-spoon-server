import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/test", (req: Request, res: Response) => {
  res.send("yo sup");
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT);
  });
});
