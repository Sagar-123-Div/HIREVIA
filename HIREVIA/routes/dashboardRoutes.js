import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { verifyToken, isJobseeker } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", verifyToken, isJobseeker, getDashboardData);

export default router;



