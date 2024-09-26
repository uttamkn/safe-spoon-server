import { getReport } from "../../controllers/inputController";
import { verifyToken } from "../../middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

router.use(verifyToken);

router.post("/get-report", getReport);

export default router;
