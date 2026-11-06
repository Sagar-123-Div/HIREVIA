import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const recruiterEmail = process.env.RECRUITER_EMAIL?.trim().toLowerCase();

    if (recruiterEmail && normalizedEmail === recruiterEmail) {
      return res.status(409).json({
        message: "This email is reserved",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "candidate",
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "candidate",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const recruiterEmail = process.env.RECRUITER_EMAIL?.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (
      !user ||
      (user.email === recruiterEmail && user.role !== "recruiter")
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isConfiguredRecruiter =
      user.role === "recruiter" &&
      Boolean(recruiterEmail) &&
      user.email === recruiterEmail;
    const isCandidate = user.role === "candidate" || user.role === "jobseeker";

    if (!isConfiguredRecruiter && !isCandidate) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: isConfiguredRecruiter ? "recruiter" : "candidate",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { register, login };
          
    
          
        