import { Router } from "express";
import {
  getProfile,
  updatePassword,
  updateProfile,
} from "../../controllers/profileController";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = Router();

router.use(verifyToken);

router.get("/get-user-profile", getProfile);
router.put("/update-user-profile", updateProfile);
router.put("/update-password", updatePassword);

export default router;
