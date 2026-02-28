import express from "express";
import {
  createStaff,
  getAdminDashboardStats,
  getRecentApplications,
  getStudentsByStatus,
  getStudentDetails,
  getAllVerifiers,
  getAllAccountancy,
  getVerifierStudents,
  getAccountancyStudents,
  toggleStaffStatus,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create-staff", protect, authorize("admin"), createStaff);

router.get("/dashboard", protect, authorize("admin"), getAdminDashboardStats);
router.get("/recent", protect, authorize("admin"), getRecentApplications);
router.get("/students", protect, authorize("admin"), getStudentsByStatus);
router.get("/students/:id", protect, authorize("admin"), getStudentDetails);

router.get("/verifiers", protect, authorize("admin"), getAllVerifiers);
router.get("/accountancy", protect, authorize("admin"), getAllAccountancy);
router.get(
  "/verifiers/:id/students",
  protect,
  authorize("admin"),
  getVerifierStudents,
);
router.get(
  "/accountancy/:id/students",
  protect,
  authorize("admin"),
  getAccountancyStudents,
);

router.patch(
  "/staff/:id/toggle-status",
  protect,
  authorize("admin"),
  toggleStaffStatus,
);

export default router;
