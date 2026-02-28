import User from "../models/user.model.js";
import Student from "../models/studentProfile.model.js";
import bcrypt from "bcryptjs";
import {
  assignVerifier,
  assignAccountant,
} from "../services/assignment.services.js";
import Csab from "../models/CsabAllotment.model.js";

export const verifyEligibility = async (req, res) => {
  try {
    const { jeeApplicationNumber } = req.body;

    const count = await Csab.countDocuments();

    if (count === 0) {
      return res.status(403).json({
        message: "Admissions not open yet",
      });
    }

    if (!jeeApplicationNumber)
      return res.status(400).json({
        message: "JEE Application Number is required",
      });

    const record = await Csab.findOne({
      jeeApplicationNumber,
    });

    if (!record)
      return res.status(404).json({
        message: "You are not allotted a seat via CSAB",
      });

    if (record.isRegistered)
      return res.status(400).json({
        message: "Candidate already registered",
      });

    // Optional: return data for prefill
    res.json({
      eligible: true,
      data: {
        name: record.name,
        program: record.program,
        category: record.category,
        state: record.stateOfEligibility,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const { jeeApplicationNumber, account, personal, academic, termsAccepted } =
      req.body;

    if (!jeeApplicationNumber || !account || !personal)
      return res.status(400).json({
        message: "Missing required data",
      });

    if (account.password !== account.confirmPassword)
      return res.status(400).json({
        message: "Passwords do not match",
      });

    // Email exists?
    const existingUser = await User.findOne({ email: account.email });
    if (existingUser)
      return res.status(400).json({
        message: "Email already registered",
      });

    // JEE number exists?
    const existingJee = await Student.findOne({
      jeeApplicationNumber,
    });
    if (existingJee)
      return res.status(400).json({
        message: "Already registered with this JEE number",
      });

    // Must exist in CSAB DB
    const csabRecord = await Csab.findOne({ jeeApplicationNumber });
    if (!csabRecord)
      return res.status(400).json({
        message: "Student not found in CSAB allotment",
      });

    // Hash password
    const hashedPassword = await bcrypt.hash(account.password, 10);

    // Create user
    const user = await User.create({
      name: personal.fullName,
      email: account.email,
      password: hashedPassword,
      role: "student",
    });

    // Auto assign staff
    const assignedVerifier = await assignVerifier();
    const assignedAccountant = await assignAccountant();

    // Create empty document structure
    const emptyDocs = {};

    // Create student profile
    const student = await Student.create({
      user: user._id,
      jeeApplicationNumber,

      account: {
        email: account.email,
        phone: account.phone,
      },

      personal: {
        fullName: personal.fullName,
        fatherName: personal.fatherName,
        motherName: personal.motherName,
        parentContact: personal.parentContact,
        parentEmail: personal.parentEmail,
        dob: personal.dob,
        gender: personal.gender,
        category: personal.category,
        bloodGroup: personal.bloodGroup,
        aadharNumber: personal.aadharNumber,
        state: personal.state,
        branchAllocated: personal.branchAllocated,
        seatAllocatedThrough: personal.seatAllocatedThrough,
        address: personal.address,
      },

      academic: {
        class10: academic.class10,
        class12: academic.class12,
        jeeRank: academic.jeeRank,
      },

      documents: emptyDocs, // will fill later
      termsAccepted,
      assignedVerifier,
      assignedAccountant,
    });

    // ===== Fee Calculation =====

    const firstSemTotal = Number(process.env.FIRST_SEM_FEE);

    const paidEarlier =
      (csabRecord.josaaSeatAcceptanceFee || 0) +
      (csabRecord.partialAdmissionFee || 0);

    const institutePayable = firstSemTotal - paidEarlier;

    student.fee = {
      firstSemTotal,
      paidEarlier,
      institutePayable,
      paidNow: 0,
      pendingVerification: 0,
      remaining: institutePayable,
    };

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      studentId: student._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Student already registered with this JEE Application Number",
      });
    }
    res.status(500).json({ message: err.message });
  }
};
export const uploadDocuments = async (req, res) => {
  try {
    const { jeeApplicationNumber } = req.body;

    // 🔴 Validate identifier
    if (!jeeApplicationNumber) {
      return res.status(400).json({
        message: "JEE Application Number is required",
      });
    }

    // 🔎 Find student by JEE number
    const student = await Student.findOne({
      jeeApplicationNumber,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const files = req.files || {};

    // 🧩 Helper function to update single doc
    const updateDoc = (key) => {
      if (files[key] && files[key][0]) {
        student.documents[key] = {
          url: files[key][0].path, // Cloudinary URL
          status: "pending",
          remark: "",
          reuploaded: true,
          updatedAt: new Date(),
        };
      }
    };

    updateDoc("photo");
    updateDoc("admissionLetter");
    updateDoc("class10Marksheet");
    updateDoc("class12Marksheet");
    updateDoc("jeeRankCard");
    updateDoc("casteCertificate");
    updateDoc("incomeCertificate");
    updateDoc("medicalCertificate");
    updateDoc("antiRaggingForm");
    updateDoc("performanceForm");
    updateDoc("aadharCard");

    // 💰 Multiple fee receipts
    if (files.feeReceipts && files.feeReceipts.length > 0) {
      student.documents.feeReceipts = files.feeReceipts.map((f) => ({
        url: f.path,
        status: "pending",
        remark: "",
        reuploaded: true,
        updatedAt: new Date(),
      }));
    }

    await student.save();

    res.json({
      message: "Documents uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocumentProgress = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student)
      return res.status(404).json({
        message: "Student not found",
      });

    const docs = student.documents;

    // Convert object to array
    const docList = Object.values(docs).flat(); // handles feeReceipts array

    // Filter only valid document objects
    const validDocs = docList.filter(
      (d) => d && typeof d === "object" && d.status,
    );

    const total = validDocs.length;

    const verified = validDocs.filter((d) => d.status === "verified").length;

    const rejected = validDocs.filter((d) => d.status === "rejected").length;

    const pending = validDocs.filter((d) => d.status === "pending").length;

    res.json({
      total,
      verified,
      rejected,
      pending,
      progress: total ? Math.round((verified / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    })
      .populate("assignedVerifier", "name email")
      .populate("assignedAccountant", "name email");

    if (!student)
      return res.status(404).json({
        message: "Student profile not found",
      });

    // Get admin user (first admin in the system)
    const admin = await User.findOne({ role: "admin" }).select("name email");

    // Add admin info to response
    const response = student.toObject();
    response.adminContact = admin;

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reuploadDocument = async (req, res) => {
  try {
    const { docType } = req.params;

    // 🔎 Find student via logged-in user
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student)
      return res.status(404).json({
        message: "Student not found",
      });

    const doc = student.documents[docType];

    if (!doc)
      return res.status(400).json({
        message: "Invalid document type",
      });

    // ❌ Allow only if rejected
    if (doc.status !== "rejected")
      return res.status(400).json({
        message: "Re-upload allowed only for rejected documents",
      });

    // ❌ Ensure file uploaded
    if (!req.file)
      return res.status(400).json({
        message: "File is required",
      });

    // ✅ Update with new Cloudinary URL
    doc.url = req.file.path;
    doc.status = "pending";
    doc.remark = "";
    doc.reuploaded = true;
    doc.updatedAt = new Date();

    await student.save();

    res.json({
      message: "Document re-uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reuploadFeeReceipt = async (req, res) => {
  try {
    const { index } = req.params;

    // 🔎 Find student via logged-in user
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student)
      return res.status(404).json({
        message: "Student not found",
      });

    const receiptIndex = parseInt(index);

    if (
      isNaN(receiptIndex) ||
      receiptIndex < 0 ||
      !student.documents.feeReceipts[receiptIndex]
    )
      return res.status(400).json({
        message: "Invalid fee receipt index",
      });

    const receipt = student.documents.feeReceipts[receiptIndex];

    // ❌ Allow only if rejected
    if (receipt.status !== "rejected")
      return res.status(400).json({
        message: "Re-upload allowed only for rejected receipts",
      });

    // ❌ Ensure file uploaded
    if (!req.file)
      return res.status(400).json({
        message: "File is required",
      });

    // ✅ Update with new Cloudinary URL
    receipt.url = req.file.path;
    receipt.status = "pending";
    receipt.remark = "";
    receipt.reuploaded = true;
    receipt.updatedAt = new Date();

    await student.save();

    res.json({
      message: "Fee receipt re-uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    // 🔴 Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Valid payment amount is required",
      });
    }

    // 🔴 Validate receipt file
    if (!req.file) {
      return res.status(400).json({
        message: "Payment receipt file is required",
      });
    }

    // 🔎 Find logged-in student's profile
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ❗ Prevent payment if already admitted
    if (student.admissionStatus === "admitted") {
      return res.status(400).json({
        message: "Admission already completed",
      });
    }

    const paymentAmount = Number(amount);

    // ==============================
    // 💰 Add payment entry
    // ==============================

    student.payments.push({
      amount: paymentAmount,
      receiptUrl: req.file.path, // ⭐ Cloudinary URL
      status: "pending",
    });

    // ==============================
    // 🔄 Update fee tracking safely
    // ==============================

    student.fee.pendingVerification =
      (student.fee.pendingVerification || 0) + paymentAmount;

    student.admissionStatus = "payment_pending";

    await student.save();

    res.json({
      message: "Payment submitted for verification",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
