import express from "express";

import {
  uploadCsabData,
  getRegistrationStatus,
  getCsabMetrics,
  getDistributionStats,
  getCsabRecords,
  exportCsabCsv,
} from "../controllers/csab.controller.js";

import { authorize } from "../middlewares/roleMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

import uploadCsv from "../middlewares/uploadCsv.js";

const router = express.Router();
// 🟢 Check if registration is open
router.get("/registration-status", getRegistrationStatus);

// 🔒 All routes → admin only
router.use(protect, authorize("admin"));

// 📤 Upload CSAB CSV
router.post("/upload", uploadCsv.single("file"), uploadCsabData);


// 📊 Dashboard metrics
router.get("/metrics", getCsabMetrics);

// 📈 All distribution charts + opening/closing ranks
router.get("/distribution", getDistributionStats);

// 📋 Detailed records (filters + pagination)
router.get("/records", getCsabRecords);

// 📤 Export CSV
router.get("/export-csv", exportCsabCsv);

export default router;
