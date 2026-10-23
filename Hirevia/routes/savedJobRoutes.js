import express from "express";
import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
} from "../controllers/savedJobController.js";
import { verifyToken, isJobseeker } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", verifyToken, isJobseeker, getSavedJobs);
router.post("/:jobId", verifyToken, isJobseeker, saveJob);
router.delete("/:jobId", verifyToken, isJobseeker, removeSavedJob);

export default router;