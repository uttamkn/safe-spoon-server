import { verifyToken } from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

router.use(verifyToken);

router.get("/test", (req, res) => {
  res.send("You are authenticated");
});
