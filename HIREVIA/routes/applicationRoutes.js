import express from "express";
import {
    applyToJob,
    getApplicationSummary,
} from "../controllers/applicationController.js";
import { verifyToken, isJobseeker } from "../middleware/authMiddle.js";

const router = express.Router();

router.post("/", verifyToken, isJobseeker, applyToJob);
router.get("/me", verifyToken, isJobseeker,
    getApplicationSummary );

export default router;