import express from "express";
import {
  signUp,
  signIn,
  getUser,
  sendEmailVerification,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/send-email-verification", sendEmailVerification);
router.get("/user", verifyToken, getUser);

export default router;
