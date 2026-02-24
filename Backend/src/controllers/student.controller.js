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
    const {
      jeeApplicationNumber,
      account,
      personal,
      academic,
      documents,
      termsAccepted,
    } = req.body;

    // 🔹 Validate required sections
    if (!jeeApplicationNumber || !account || !personal)
      return res.status(400).json({
        message: "Missing required data",
      });

    // 🔹 Password match check
    if (account.password !== account.confirmPassword)
      return res.status(400).json({
        message: "Passwords do not match",
      });

    // 🔹 Check email already exists
    const existingUser = await User.findOne({
      email: account.email,
    });

    if (existingUser)
      return res.status(400).json({
        message: "Email already registered",
      });

    // 🔹 Check JEE number already registered
    const existingJee = await Student.findOne({
      jeeApplicationNumber,
    });

    if (existingJee)
      return res.status(400).json({
        message: "Already registered with this JEE number",
      });

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(account.password, 10);

    // 🔹 Create User account
    const user = await User.create({
      name: personal.fullName,
      email: account.email,
      password: hashedPassword,
      role: "student",
    });

    // 🔹 Transform documents into structured format
    const formattedDocs = {
      photo: { url: documents.photo },
      admissionLetter: { url: documents.admissionLetter },
      class10Marksheet: { url: documents.class10Marksheet },
      class12Marksheet: { url: documents.class12Marksheet },
      jeeRankCard: { url: documents.jeeRankCard },
      casteCertificate: { url: documents.casteCertificate },
      incomeCertificate: { url: documents.incomeCertificate },
      medicalCertificate: { url: documents.medicalCertificate },
      antiRaggingForm: { url: documents.antiRaggingForm },
      performanceForm: { url: documents.performanceForm },
      aadharCard: { url: documents.aadharCard },

      feeReceipts: documents.feeReceipts?.map((url) => ({ url })) || [],
    };

    // 🔥 AUTO ASSIGN STAFF
    const assignedVerifier = await assignVerifier();
    const assignedAccountant = await assignAccountant();

    // 🔹 Create Student Profile
    const student = await Student.create({
      user: user._id,
      jeeApplicationNumber,

      account: {
        email: account.email,
        phone: account.phone,
      },

      personal,
      academic,
      documents: formattedDocs,
      termsAccepted,
      assignedVerifier,
      assignedAccountant,
    });

    // ======================================
    // 🔥 FETCH CSAB DATA + UPDATE FEE
    // ======================================

    const csabRecord = await Csab.findOne({
      jeeApplicationNumber,
    });

    if (!csabRecord)
      return res.status(400).json({
        message: "Student not found in CSAB allotment",
      });

    // 💰 First semester fee from ENV
    const firstSemTotal = Number(process.env.FIRST_SEM_FEE);

    // 💰 Paid earlier = SAF + PAF ONLY
    const paidEarlier =
      (csabRecord.josaaSeatAcceptanceFee || 0) +
      (csabRecord.partialAdmissionFee || 0);

    const institutePayable = firstSemTotal - paidEarlier;

    // 🎯 Update fee object
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
    // 🔥 Duplicate JEE Application Number
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Student already registered with this JEE Application Number",
      });
    }
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

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reuploadDocument = async (req, res) => {
  try {
    const { docType } = req.params; // e.g. "photo"
    const { url } = req.body;

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

    // ❌ Allow reupload ONLY if rejected
    if (doc.status !== "rejected")
      return res.status(400).json({
        message: "Re-upload allowed only for rejected documents",
      });

    // ✅ Overwrite
    doc.url = url;
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

export const uploadPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount)
      return res.status(400).json({
        message: "Payment amount is required",
      });

    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student)
      return res.status(404).json({
        message: "Student not found",
      });

    // ❗ Prevent payment if already admitted
    if (student.admissionStatus === "admitted")
      return res.status(400).json({
        message: "Admission already completed",
      });

    // ==============================
    // 💰 Add payment entry
    // ==============================

    student.payments.push({
      amount: Number(amount),
      receiptUrl: req.file.path, // ⭐ Cloudinary URL
      status: "pending",
    });

    // ==============================
    // 🔄 Update fee tracking
    // ==============================

    student.fee.pendingVerification += Number(amount);

    student.admissionStatus = "payment_pending";

    await student.save();

    res.json({
      message: "Payment submitted for verification",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};