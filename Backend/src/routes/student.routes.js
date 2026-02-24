import express from "express";

import {
  registerStudent,
  getMyProfile,
  getDocumentProgress,
  reuploadDocument,
  uploadPayment,
  verifyEligibility
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

router.get("/documents/progress", getDocumentProgress);

// =====================================================
// 📤 UPLOAD DOCUMENT (Initial Upload)
// =====================================================

router.post(
  "/documents/upload/:docType",
  upload.single("file"),
  async (req, res) => {
    res.json({
      message: "Document uploaded successfully",
      url: req.file.path, // ⭐ Cloudinary URL
    });
  },
);

// =====================================================
// 🔁 RE-UPLOAD REJECTED DOCUMENT
// =====================================================

router.put(
  "/documents/reupload/:docType",
  upload.single("file"),
  reuploadDocument,
);


// =====================================================
// 💰 UPLOAD PAYMENT RECEIPT
// =====================================================

router.post("/payments/upload", upload.single("receipt"), uploadPayment);

export default router;
