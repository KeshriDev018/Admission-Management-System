import express from "express";

import {
  getMyPaymentStudents,
  getPaymentDetails,
  approvePayment,
  rejectPayment,
} from "../controllers/accountancy.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔒 Accountancy + Admin access
router.use(protect, authorize("accountancy", "admin"));

// 📋 Assigned payment cases
router.get("/my-payments", getMyPaymentStudents);

// 📄 View full payment details
router.get("/student/:id", getPaymentDetails);

// 💰 Approve payment
router.put("/approve/:studentId/:paymentId", approvePayment);

// ❌ Reject payment
router.put("/reject/:studentId/:paymentId", rejectPayment);

export default router;
