import { Router } from "express";
import {
  signUp,
  signIn,
  verifyUser,
  sendEmailVerification,
  verifyEmail,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.put("/send-email-verification", sendEmailVerification);
router.delete("/verify-email", verifyEmail);
router.get("/verify-user", verifyToken, verifyUser);

export default router;
