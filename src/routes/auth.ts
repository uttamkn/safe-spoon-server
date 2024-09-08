import express from "express";
import { signUp, signIn } from "../controllers/authController";

const router = express.Router();

router.put("/sign_up", signUp);
router.post("/sign_in", signIn);
export default router;
