import Job from "../model/job.js";

const editableFields = [
  "title",
  "company",
  "description",
  "salary",
  "location",
  "jobType",
  "experience",
  "openings",
  "requirements",
  "benefits",
];

const createJob = async (req, res) => {
  try {
    const body = req.body ?? {};
    const job = await Job.create({
      ...Object.fromEntries(
        editableFields
          .filter((field) => body[field] !== undefined)
          .map((field) => [field, body[field]])
      ),
      company:
        body.company?.trim() ||
        process.env.RECRUITER_NAME?.trim() ||
        req.user.name,
      postedBy: req.user._id,
    });

    return res.status(201).json({ job });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.keyword) {
      filter.title = { $regex: req.query.keyword, $options: "i" };
    }
    if (req.user?.role === "recruiter") {
      filter.postedBy = req.user._id;
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role === "recruiter") {
      filter.postedBy = req.user._id;
    }
    const job = await Job.findOne(filter).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch {
    return res.status(400).json({ message: "Invalid job ID" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const body = req.body ?? {};
    editableFields.forEach((field) => {
      if (body[field] !== undefined) {
        job[field] = body[field];
      }
    });

    const updatedJob = await job.save();
    return res.status(200).json({ job: updatedJob });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch {
    return res.status(400).json({ message: "Invalid job ID" });
  }
};

export { createJob, getAllJobs, getJobById, updateJob, deleteJob };
