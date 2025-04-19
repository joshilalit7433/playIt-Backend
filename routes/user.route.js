import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  AdminDashboard,
  getPendingTurfDetails,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

// Admin routes
router.route("/admin/dashboard").get(isAdmin, AdminDashboard);
router.route("/admin/dashboard/:turfId").get(isAdmin, getPendingTurfDetails);

export default router;
