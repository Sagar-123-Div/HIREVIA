import express from "express";
import {
    applyToJob,
    getMyApplication,
    getApplicationSummary,
} from "../controllers/applicationController.js";
import { verifyToken, isJobseeker } from "../middleware/authMiddle.js";

const router = express.Router();

router.post("/", verifyToken, isJobseeker, applyToJob);
router.get("/me", verifyToken, isJobseeker, getMyApplication);
router.get("/summary", verifyToken, isJobseeker, getApplicationSummary);

export default router;