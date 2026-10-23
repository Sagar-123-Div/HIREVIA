import mongoose from "mongoose";

export { mongoose };

const connectDB = async () => {
    try {
            const mongoUri = process.env.MONGODB_URI || process.env.MONGOOSE_URI;

            if (!mongoUri) {
                throw new Error(
                    "Missing MongoDB connection string. Set MONGODB_URI in a .env file."
                );
            }

            await mongoose.connect(mongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;