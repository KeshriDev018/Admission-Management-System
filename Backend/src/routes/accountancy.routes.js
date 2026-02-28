import express from "express";

import {
  getMyPaymentStudents,
  getPaymentDetails,
  approvePayment,
  rejectPayment,
  getMyAdmittedStudents,
  getMyRejectedPaymentStudents,
} from "../controllers/accountancy.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔒 Accountancy + Admin access
router.use(protect, authorize("accountancy", "admin"));

// 🟡 Pending payment cases (WORK TAB)
router.get("/my-payments", getMyPaymentStudents);

// 🔴 Rejected payments (needs re-upload)
router.get("/my-rejected-payments", getMyRejectedPaymentStudents);

// 🟢 Completed admissions (fully paid)
router.get("/my-admitted", getMyAdmittedStudents);

// 📄 View full payment details of a student
router.get("/student/:id", getPaymentDetails);

// 💰 Approve payment
router.put("/approve/:studentId/:paymentId", approvePayment);

// ❌ Reject payment
router.put("/reject/:studentId/:paymentId", rejectPayment);

export default router;
