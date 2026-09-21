import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const experienceSchema = new mongoose.Schema(
    {
        company: { type: String, trim: true },
        title: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String, trim: true },
    },
    { _id: false }
);

const educationSchema = new mongoose.Schema(
    {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["jobseeker" , "recruiter"],
            required: true,

        },
        skills: {
            type:[String],
            default:[],
        },

        experience: {
            type:[experienceSchema],
            default:[],
        },
         education: {
            type: [educationSchema],
            default:[],
         },
         savedJobs: [
        {
        job: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Job",
         required: true,
         },

         savedAt: {
        type: Date,
        default: Date.now,
          },
         },
        ],
        },
    { timestamps: true }

);

userSchema.pre("save" , async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);

});

export default mongoose.model("User" , userSchema);
