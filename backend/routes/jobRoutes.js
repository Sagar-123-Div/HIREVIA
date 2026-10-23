import express from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
import { verifyToken, isRecruiter } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post("/", verifyToken, isRecruiter, createJob);
router.post("/:id", verifyToken, isRecruiter, updateJob);
router.delete("/:id", verifyToken, isRecruiter, deleteJob);

export default router;
