import Application from "../model/Application.js";
import Job from "../model/job.js";

const getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const applications = await Application.find({
      job: { $in: jobs.map((job) => job._id) },
    })
      .populate("applicant", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      applications: applications.map((application) => ({
        id: application._id,
        _id: application._id,
        status: application.status,
        appliedAt: application.createdAt,
        resume: application.resume || "",
        applicant: application.applicant
          ? {
              id: application.applicant._id,
              name: application.applicant.name,
              email: application.applicant.email,
            }
          : null,
        job: application.job
          ? {
              id: application.job._id,
              _id: application.job._id,
              title: application.job.title,
            }
          : null,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const applyToJob = async (req, res) => {
  try {
    const body = req.body ?? {};
    const jobId = body.jobId || body.job;

    if (typeof jobId !== "string" || !jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    const resume =
      typeof body.resume === "string" ? body.resume : req.user.resume || "";
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        select: "title location jobType salary company",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getApplicationSummary = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title location jobType salary postedBy",
        populate: {
          path: "postedBy",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const total = applications.length;
    const pending = applications.filter((app) => app.status === "pending").length;
    const accepted = applications.filter((app) => app.status === "accepted").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;
    const considered = applications.filter(
      (app) => app.status === "considered"
    ).length;

    return res.status(200).json({
      total,
      pending,
      considered,
      accepted,
      rejected,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body ?? {};
    if (!["considered", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be considered or rejected",
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const ownedJob = await Job.findOne({
      _id: application.job,
      postedBy: req.user._id,
    });
    if (!ownedJob) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();
    return res.status(200).json({ application });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  getRecruiterApplications,
  applyToJob,
  getMyApplication,
  getApplicationSummary,
  updateApplicationStatus,
};
