import Application from "../model/Application.js";
import Job from "../model/job.js";

const applyToJob = async (req, res) => {
    try {
        const { job, resume } = req.body;

        if (!job || !resume) {
           return res.status(400).json ({
             message: "Job ID and resume link are required",

           });

        }
        const jobExists = await Job.findById(job);
        
        if (!jobExists) {
          return res.status(404).json({
            message: "Job not found",
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
        try{
         const applicant = req.user._id;


         const total = await Application.countDocuments ({ applicant });
         const pending = await Application.countDocuments({ 
            applicant,
            status: "pending",

         });
         const accepted = await Application.countDocuments({
            applicant,
            status: "accepted",
         });
         const rejected = await Application.countDocuments({
            applicant,
            status: "rejected",
         });
         
        res.status(200).json({
            total,
            pending,
            accepted,
            rejected,
        });

        } catch (error)  {
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

     
    

