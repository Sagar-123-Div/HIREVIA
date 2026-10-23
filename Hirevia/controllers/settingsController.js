import bcrypt from "bcryptjs";
import User from "../model/User.js";
import Application from "../model/Application.js";

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
      notificationPreferences: user.notificationPreferences || {
        jobAlerts: true,
        applicationUpdates: true,
        marketingEmails: false,
      },
      publicProfile: user.publicProfile ?? true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/settings/account
const updateAccountSettings = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;

    await user.save();

    res.status(200).json({
      message: "Account settings updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/settings/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must contain at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    const isCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save(); // User pre-save hook hashes the new password

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/settings/preferences
const updatePreferences = async (req, res) => {
  try {
    const {
      jobAlerts,
      applicationUpdates,
      marketingEmails,
      publicProfile,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.notificationPreferences) {
      user.notificationPreferences = {};
    }

    if (typeof jobAlerts === "boolean") {
      user.notificationPreferences.jobAlerts = jobAlerts;
    }

    if (typeof applicationUpdates === "boolean") {
      user.notificationPreferences.applicationUpdates = applicationUpdates;
    }

    if (typeof marketingEmails === "boolean") {
      user.notificationPreferences.marketingEmails = marketingEmails;
    }

    if (typeof publicProfile === "boolean") {
      user.publicProfile = publicProfile;
    }

    await user.save();

    res.status(200).json({
      message: "Preferences updated successfully",
      notificationPreferences: user.notificationPreferences,
      publicProfile: user.publicProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/settings/account
const deleteMyAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        message: "Current password is required",
      });
    }

    const user = await User.findById(req.user._id);

    const isCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    await Application.deleteMany({
      applicant: user._id,
    });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      message: "Account and application history deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getSettings,
  updateAccountSettings,
  changePassword,
  updatePreferences,
  deleteMyAccount,
};