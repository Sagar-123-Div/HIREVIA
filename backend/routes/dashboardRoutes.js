import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { verifyToken, isCandidate } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", verifyToken, isCandidate, getDashboardData);

export default router;


