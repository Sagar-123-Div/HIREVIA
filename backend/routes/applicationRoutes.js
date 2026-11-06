import express from "express";
import {
    applyToJob,
    getMyApplication,
    getApplicationSummary,
    getRecruiterApplications,
    updateApplicationStatus,
} from "../controllers/applicationController.js";
import {
    verifyToken,
    isCandidate,
    isRecruiter,
} from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/recruiter", verifyToken, isRecruiter, getRecruiterApplications);
router.patch("/:id/status", verifyToken, isRecruiter, updateApplicationStatus);
router.post("/", verifyToken, isCandidate, applyToJob);
router.get("/me", verifyToken, isCandidate, getMyApplication);
router.get("/summary", verifyToken, isCandidate, getApplicationSummary);

export default router;