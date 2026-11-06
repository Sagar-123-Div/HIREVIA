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
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isRecruiter = (req, res, next) => {
  const recruiterEmail = process.env.RECRUITER_EMAIL?.trim().toLowerCase();

  if (
    req.user.role !== "recruiter" ||
    !recruiterEmail ||
    req.user.email !== recruiterEmail
  ) {
    return res.status(403).json({ message: "Recruiter access only" });
  }
  next();
};

const isCandidate = (req, res, next) => {
  if (!["candidate", "jobseeker"].includes(req.user.role)) {
    return res.status(403).json({ message: "Candidate access only" });
  }
  next();
};

const optionalVerifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  return verifyToken(req, res, next);
};

export {
  verifyToken,
  optionalVerifyToken,
  isRecruiter,
  isCandidate,
  isCandidate as isJobseeker,
};
