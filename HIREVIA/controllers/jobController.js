import Job from "../model/job.js";

const createJob = async (req, res) => {
  try {
    const { title, description, salary, location, jobType } = req.body;

    if (!title || !description || !salary || !location || !jobType) {
      return res.status(400).json({
        message: "title, description, salary, location, and jobType are required",
      });
    }

    const job = await Job.create({
      title,
      description,
      salary,
      location,
      jobType,
      postedBy: req.user._id,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(400).json({ message: "Invalid job ID" });
  }
};

export { createJob, getAllJobs, getJobById, updateJob, deleteJob };
