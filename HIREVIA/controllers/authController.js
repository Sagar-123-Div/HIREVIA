import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//POST /api/auth/register
const register = async(req, res) => {
    try{
        const { name, email, password, role } =req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
              message: "Name, email, password and role are required",
            });
           }

           if (!["jobseeker" , "recruiter"].includes(role)) {
             return res.status(400).json({
              message: "Role must be jobseeker or recruiter",
             });
           }

           const userExists = await User.findOne({ email });

           if (userExists) {
             return res.status(400).json({
              message: "Email already registered",

             });
           }

           const user = await User.create({
            name,
            email,
            password,
            role,

           });
            
           const token = createToken(user._id);

           res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
           });
    } catch (error) {
      res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

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
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export { register, login };
          
    
          
        