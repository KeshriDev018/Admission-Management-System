import express from "express";

import {
  getMyPendingStudents,
  getAssignedStudentDetails,
  verifyDocument,
  rejectReceipt,rejectDocument,verifyReceipt
} from "../controllers/verifier.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔒 All routes require login + verifier/admin role
router.use(protect, authorize("verifier", "admin"));

// 📋 Get students assigned to me (pending verification)
router.get("/my-pending", getMyPendingStudents);

// 📄 Get full details of a specific student
router.get("/student/:id", getAssignedStudentDetails);

router.put(
  "/documents/verify/:studentId/:docType",
  protect,
  verifyDocument,
);

router.put(
  "/documents/reject/:studentId/:docType",
  protect,
  rejectDocument,
);

// Receipt-specific

// VERIFY CSAB RECEIPT
router.put(
  "/receipts/verify/:studentId/:index",
  protect,
  authorize("verifier", "admin"),
  verifyReceipt
);

router.put(
  "/receipts/reject/:studentId/:index",
  protect,
  rejectReceipt,
);

export default router;
