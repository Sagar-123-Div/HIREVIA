import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", verifyToken, getMyProfile);
router.patch("/", verifyToken, updateMyProfile);

export default router;