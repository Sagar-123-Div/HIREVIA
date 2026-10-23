import mongoose from "mongoose";
import User from "../model/User.js";
import Job from "../model/job.js";

// POST /api/saved-jobs/:jobId
const saveJob = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.isValidObjectId(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedJobs.some(
      (savedJob) => savedJob.job?.toString() === job._id.toString()
    );

    if (alreadySaved) {
      return res.status(200).json({
        message: "Job is already saved",
        alreadySaved: true,
      });
    }

    user.savedJobs.push({ job: job._id });

    await user.save();

    res.status(201).json({
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error("Failed to save job:", error);
    res.status(500).json({
      message: "Could not save job",
    });
  }
};

// GET /api/saved-jobs
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs.job",
      populate: {
        path: "postedBy",
        select: "name email",
      },
    });

    const savedJobs = user.savedJobs
      .filter((item) => item.job)
      .map((item) => ({
        savedAt: item.savedAt,
        job: item.job,
      }));

    res.status(200).json({
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    console.error("Failed to load saved jobs:", error);
    res.status(500).json({
      message: "Could not load saved jobs",
    });
  }
};

// DELETE /api/saved-jobs/:jobId
const removeSavedJob = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.isValidObjectId(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedJobs = user.savedJobs.filter(
      (savedJob) => savedJob.job?.toString() !== jobId
    );

    await user.save();

    res.status(200).json({
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error("Failed to remove saved job:", error);
    res.status(500).json({
      message: "Could not remove saved job",
    });
  }
};

export {
  saveJob,
  getSavedJobs,
  removeSavedJob,
};