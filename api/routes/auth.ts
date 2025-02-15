import { Router } from "express";
import {
  signUp,
  signIn,
  verifyUser,
  sendEmailVerification,
  verifyEmail,
  handleForgotPassword,
  handleResetPassword,
} from "../../controllers/authController";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

router.put("/send-email-verification", sendEmailVerification);
router.delete("/verify-email", verifyEmail);

router.get("/verify-user", verifyToken, verifyUser);

router.post("/forgot-password", handleForgotPassword);
router.put("/reset-password/:token", handleResetPassword);

export default router;
