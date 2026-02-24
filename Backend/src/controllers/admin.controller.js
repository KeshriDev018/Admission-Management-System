import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



import Student from "../models/studentProfile.model.js";


export const getAdminDashboardStats = async (req, res) => {
  try {
    // =============================
    // 🔢 Summary Cards
    // =============================

    const totalApplications = await Student.countDocuments();

    const verified = await Student.countDocuments({
      admissionStatus: "verified",
    });

    const pending = await Student.countDocuments({
      admissionStatus: "pending_verification",
    });

    const todayApps = await Student.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    // =============================
    // 📊 Category Distribution
    // =============================

    const categoryStats = await Student.aggregate([
      { $group: { _id: "$personal.category", count: { $sum: 1 } } },
    ]);

    // =============================
    // 📊 State Distribution
    // =============================

    const stateStats = await Student.aggregate([
      { $group: { _id: "$personal.state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // =============================
    // 💰 Fee Payment Status
    // (Using Student.fee fields — since model has them)
    // =============================

    const paid = await Student.countDocuments({
      "fee.remaining": 0,
    });

    const halfPaid = await Student.countDocuments({
      "fee.remaining": { $gt: 0 },
      "fee.paidNow": { $gt: 0 },
    });

    const notPaid = totalApplications - paid - halfPaid;

    // =============================
    // 👥 Gender Distribution
    // =============================

    const genderStats = await Student.aggregate([
      { $group: { _id: "$personal.gender", count: { $sum: 1 } } },
    ]);

    // =============================
    // 🆕 Recent Applications
    // =============================

    const recentApplications = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.json({
      summary: {
        totalApplications,
        verified,
        pending,
        todayApps,
      },

      categoryStats,
      stateStats,

      paymentStats: {
        paid,
        halfPaid,
        notPaid,
      },

      genderStats,

      recentApplications,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getRecentApplications = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 🔍 Filter by admission status
    if (status) {
      filter.admissionStatus = status;
    }

    // 🔎 Search by name or JEE Application Number
    if (search) {
      filter.$or = [
        { "personal.fullName": { $regex: search, $options: "i" } },
        { jeeApplicationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const applications = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name email");

    const total = await Student.countDocuments(filter);

    res.json({
      totalRecords: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      applications,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create staff user (Verifier or Accountancy)
export const createStaff = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    
    if (!["verifier", "accountancy"].includes(role))
      return res.status(400).json({
        message: "Invalid role",
      });

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({
        message: "User already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: `${role} created successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentsByStatus = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 🧭 Filter by status (if not "all")
    if (status && status !== "all") {
      filter.admissionStatus = status;
    }

    // 🔍 Search
    if (search) {
      filter.$or = [
        { "personal.fullName": { $regex: search, $options: "i" } },
        { jeeApplicationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name email")
      .populate("assignedVerifier", "name email")
      .populate("assignedAccountant", "name email");

    const total = await Student.countDocuments(filter);

    res.json({
      totalRecords: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      students,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
