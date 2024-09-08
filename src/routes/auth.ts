import express from "express";
import { signUp, signIn, getUser } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.put("/sign_up", signUp);
router.post("/sign_in", signIn);
router.get("/user", verifyToken, getUser);

export default router;
