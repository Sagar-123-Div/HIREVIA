import "dotenv/config";
import express, { json } from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(json());


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/" , (req,res) => {
  res.send("HireVia API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});