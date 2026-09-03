import jwt from "jsonwebtoken";
import User from "../model/User.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token is required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Recruiter access only" });
  }
  next();
};

const isJobseeker = (req, res, next) => {
  if (req.user.role !== "jobseeker") {
    return res.status(403).json({ message: "Jobseeker access only" });
  }
  next();
};

export { verifyToken, isRecruiter, isJobseeker };
