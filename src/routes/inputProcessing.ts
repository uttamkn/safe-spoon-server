import { handleOcr } from "../controllers/inputController";
import { verifyToken } from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

router.use(verifyToken);

router.post("/ocr", handleOcr);

export default router;
