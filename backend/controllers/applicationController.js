import Application from "../model/Application.js";
import Job from "../model/job.js";

const applyToJob = async (req, res) => {
    try {
        const { job } = req.body;

        if (!job) {
          return res.status(400).json({
            message: "Job ID is required",
          });
        }

        const jobExists = await Job.findById(job);

        if (!jobExists) {
          return res.status(404).json({
            message: "Job not found",
          });
        }

        const existingApplication = await Application.findOne({
          job,
          applicant: req.user._id,
        });

        if (existingApplication) {
          return res.status(409).json({
            message: "You have already applied for this job",
          });
        }

        const resume = req.body.resume || req.user.resume;

        if (!resume) {
          return res.status(400).json({
            message: "Add a resume to your profile before applying",
          });
        }

        const application = await Application.create({
         job,
         applicant: req.user._id,
         resume,
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
    };
    const getMyApplication = async (req, res) => {
     try{
        const applications = await Application.find({
            applicant: req.user._id,
        })
        .populate({
            path: "job",
            select: "title location jobType salary postedBy",
            populate: {
                path: "postedBy",
                select: "name email",
            },
         })
                 .sort({ createdAt: -1 });

                 res.status(200).json({
          count: applications.length,
          applications,
        });

     } catch (error) {
        res.status(500).json({
            message: error.message,

        });

     }
    };
    const getApplicationSummary = async (req, res) => {
        try {
            const applicant = req.user._id;
            const applications = await Application.find({ applicant })
                .populate({
                    path: "job",
                    select: "title location jobType salary postedBy",
                    populate: {
                        path: "postedBy",
                        select: "name email",
                    },
                })
                .sort({ createdAt: -1 });

            const total = applications.length;
            const pending = applications.filter((app) => app.status === "pending").length;
            const accepted = applications.filter((app) => app.status === "accepted").length;
            const rejected = applications.filter((app) => app.status === "rejected").length;

            res.status(200).json({
                total,
                pending,
                accepted,
                rejected,
                applications,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };

    export {
        applyToJob,
        getMyApplication,
        getApplicationSummary,
    };

     
    
