import express from "express";
import {
  signUp,
  signIn,
  getUser,
  sendEmailVerification,
  verifyEmail,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.put("/send-email-verification", sendEmailVerification);
router.delete("/verify-email", verifyEmail);
router.get("/user", verifyToken, getUser);

export default router;
