import Job from "../model/job.js";
import Application from "../model/Application.js";

// GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        select: "title location jobType postedBy",
        populate: {
          path: "postedBy",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const recommendedJobs = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.postedBy?.name || "Recruiter",
      location: job.location,
      type: job.jobType,
      postedAt: job.createdAt,
      logo: job.postedBy?.name?.charAt(0).toUpperCase() || "J",
    }));

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      recommendedJobs,
      recentApplications: applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load dashboard",
      error: error.message,
    });
  }
};

export { getDashboardData };
    










    
    