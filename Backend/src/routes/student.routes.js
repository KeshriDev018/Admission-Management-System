import express from "express";

import {
  registerStudent,
  getMyProfile,
  getDocumentProgress,
  reuploadDocument,
  reuploadFeeReceipt,
  uploadPayment,
  verifyEligibility,
  uploadDocuments,
} from "../controllers/student.controller.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

import upload from "../middlewares/upload.js"; // ⭐ YOUR CloudinaryStorage setup

const router = express.Router();

router.post("/verify-eligibility", verifyEligibility);

// =====================================================
// 🧾 PUBLIC ROUTE — STUDENT REGISTRATION
// =====================================================

router.post("/register", registerStudent);

router.post(
  "/upload-documents",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "admissionLetter", maxCount: 1 },
    { name: "class10Marksheet", maxCount: 1 },
    { name: "class12Marksheet", maxCount: 1 },
    { name: "jeeRankCard", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "incomeCertificate", maxCount: 1 },
    { name: "medicalCertificate", maxCount: 1 },
    { name: "antiRaggingForm", maxCount: 1 },
    { name: "performanceForm", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "feeReceipts", maxCount: 5 },
  ]),
  uploadDocuments,
);

// =====================================================
// 🔐 ALL ROUTES BELOW REQUIRE STUDENT LOGIN
// =====================================================

router.use(protect, authorize("student"));

// =====================================================
// 👤 GET MY PROFILE
// =====================================================

router.get("/me", getMyProfile);

// =====================================================
// 📊 DOCUMENT VERIFICATION PROGRESS
// (for dashboard: 3/5 verified etc.)
// =====================================================

router.get("/documents/progress", authorize("student"), getDocumentProgress);

// =====================================================
// 🔁 RE-UPLOAD REJECTED DOCUMENT
// =====================================================

router.put(
  "/documents/reupload/:docType",
  authorize("student"),
  upload.single("file"),
  reuploadDocument,
);

// =====================================================
// 🔁 RE-UPLOAD REJECTED FEE RECEIPT
// =====================================================

router.put(
  "/documents/reupload-receipt/:index",
  authorize("student"),
  upload.single("file"),
  reuploadFeeReceipt,
);

// =====================================================
// 💰 UPLOAD PAYMENT RECEIPT
// =====================================================

router.post(
  "/payments/upload",
  authorize("student"),
  upload.single("receipt"),
  uploadPayment,
);

export default router;
