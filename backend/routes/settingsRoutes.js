import express from "express" ;
import {
  getSettings,
  updateAccountSettings,
  changePassword,
  updatePreferences,
  deleteMyAccount,
} from "../controllers/settingsController.js";
import { verifyToken } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/", verifyToken, getSettings);
router.patch("/account", verifyToken, updateAccountSettings);
router.patch("/password", verifyToken, changePassword);
router.patch("/preferences", verifyToken, updatePreferences);
router.delete("/account", verifyToken, deleteMyAccount);

export default router;