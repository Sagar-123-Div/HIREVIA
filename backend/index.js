import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
const app = express();

const clientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: [
      ...clientOrigins,
      "https://hirevia-frontend-job.onrender.com",
      "http://localhost:5173",
    ].filter(Boolean),
  })
);
app.use(json());


app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/landing", landingRoutes);

app.get("/" , (req,res) => {
  res.send("HireVia API is running");
});

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
