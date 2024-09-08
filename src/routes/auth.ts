import express from "express";
import { signUp, signIn, getUser } from "../controllers/authController";

const router = express.Router();

router.put("/sign_up", signUp);
router.post("/sign_in", signIn);
router.get("/user", getUser);

export default router;
