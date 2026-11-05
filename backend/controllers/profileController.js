import User from "../model/User.js";

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const completedFields = [
      user.name,
      user.email,
      user.headline,
      user.location,
      user.phone,
      user.about,
      user.resume,
      Array.isArray(user.skills) && user.skills.length > 0,
      Array.isArray(user.experience) && user.experience.length > 0,
      Array.isArray(user.education) && user.education.length > 0,
    ];

    const profileStrength = Math.round(
      (completedFields.filter(Boolean).length / completedFields.length) * 100
    );

    res.status(200).json({
      user,
      profileStrength,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/profile
const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "headline",
      "location",
      "phone",
      "about",
      "profileImageUrl",
      "resume",
      "skills",
      "experience",
      "education",
      "jobPreferences",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This email is already in use",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

export {
  getMyProfile,
  updateMyProfile,
};