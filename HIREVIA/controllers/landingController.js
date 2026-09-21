import Job from "../model/job.js";
import User from "../model/User.js";

// GET /api/landing
const getLandingData = async (req, res) => {
  try {
    const [totalJobs, totalRecruiters, totalJobseekers, latestJobs] =
      await Promise.all([
        Job.countDocuments(),
        User.countDocuments({ role: "recruiter" }),
        User.countDocuments({ role: "jobseeker" }),
        Job.find()
          .populate("postedBy", "name")
          .sort({ createdAt: -1 })
          .limit(6),
      ]);

    res.status(200).json({
      stats: {
        totalJobs,
        totalRecruiters,
        totalJobseekers,
      },

      latestJobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load landing page data",
      error: error.message,
    });
  }
};

export { getLandingData };