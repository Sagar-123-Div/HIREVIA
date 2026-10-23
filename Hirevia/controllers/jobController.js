import Job from "../model/job.js";
const createJob = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required to post a job",
      });
    }

    const { title, description, salary, location, jobType } = req.body;

    const job = await Job.create({
      title,
      description,
      salary,
      location,
      jobType,
      postedBy: req.user._id, // use the ID from your auth middleware
    });

    return res.status(201).json({ success: true, job });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllJobs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const filter = keyword
      ? { title: { $regex: keyword, $options: "i" } }
      : {};

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch {
    res.status(400).json({ message: "Invalid job ID" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the job owner can update this job",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "salary",
      "location",
      "jobType",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    const updatedJob = await job.save();
    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch {
    res.status(400).json({ message: "Invalid job ID" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the job owner can delete this job",
      });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid job ID" });
  }
};

export { createJob, getAllJobs, getJobById, updateJob, deleteJob };
