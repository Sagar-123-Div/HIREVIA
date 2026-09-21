import User from "../model/User.js";
import Job from "../model/job.js";

// POST /api/saved-jobs/:jobId
const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedJobs.some(
      (savedJob) => savedJob.job.toString() === job._id.toString()
    );

    if (alreadySaved) {
      return res.status(400).json({
        message: "Job is already saved",
      });
    }

    user.savedJobs.push({ job: job._id });

    await user.save();

    res.status(201).json({
      message: "Job saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/saved-jobs/:jobId
const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const beforeCount = user.savedJobs.length;

    user.savedJobs = user.savedJobs.filter(
      (savedJob) => savedJob.job.toString() !== req.params.jobId
    );

    if (user.savedJobs.length === beforeCount) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    await user.save();

    res.status(200).json({
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export {
  saveJob,
  getSavedJobs,
  removeSavedJob,
};