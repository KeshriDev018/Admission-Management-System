import express from "express";
import { createStaff,getAdminDashboardStats,getRecentApplications,getStudentsByStatus } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create-staff", protect, isAdmin, createStaff);

router.get("/dashboard", protect, authorize("admin"), getAdminDashboardStats);
router.get("/recent", protect, authorize("admin"), getRecentApplications);
router.get("/students", protect, authorize("admin"), getStudentsByStatus);

export default router;
