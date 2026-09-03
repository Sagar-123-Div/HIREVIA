import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    },
    { timestamps: true }

);

userSchema.pre("save" , async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);

});

export default mongoose.model("User" , userSchema);
