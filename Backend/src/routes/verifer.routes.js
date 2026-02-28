import express from "express";

import {
  getMyPendingStudents,
  getMyVerifiedStudents,
  getRejectedNotReuploadedStudents,
  getRejectedReuploadedStudents,
  getAssignedStudentDetails,
  verifyDocument,
  rejectReceipt,
  rejectDocument,
  verifyReceipt,
} from "../controllers/verifier.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔒 All routes require login + verifier/admin role
router.use(protect, authorize("verifier", "admin"));

// 📋 Get students assigned to me (pending verification)
router.get("/my-pending", getMyPendingStudents);

// � Get verified students
router.get("/my-verified", getMyVerifiedStudents);

// 📋 Rejected docs — NOT reuploaded (student action pending)
router.get("/my-rejected-pending", getRejectedNotReuploadedStudents);

// 📋 Rejected docs — Reuploaded (needs re-verification)
router.get("/my-rejected-reuploaded", getRejectedReuploadedStudents);

// �📄 Get full details of a specific student
router.get("/student/:id", getAssignedStudentDetails);

router.put("/documents/verify/:studentId/:docType", protect, verifyDocument);

router.put("/documents/reject/:studentId/:docType", protect, rejectDocument);

// Receipt-specific

// VERIFY CSAB RECEIPT
router.put(
  "/receipts/verify/:studentId/:index",
  protect,
  authorize("verifier", "admin"),
  verifyReceipt,
);

router.put(
  "/receipts/reject/:studentId/:index",
  protect,
  authorize("verifier", "admin"),
  rejectReceipt,
);

export default router;
