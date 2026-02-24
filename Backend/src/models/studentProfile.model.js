import mongoose from "mongoose";

const docField = () => ({
  url: String,

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  remark: {
    type: String,
    default: "",
  },

  reuploaded: {
    type: Boolean,
    default: false,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const studentProfileSchema = new mongoose.Schema({
  // 🔹 Phase 1 — Verification

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  jeeApplicationNumber: {
  type: String,
  required: true,
  unique: true,
},

  // 🔹 Phase 3 Step 1 — Account
  account: {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },

  // 🔹 Step 2 — Personal Details
  personal: {
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },

    parentContact: { type: String, required: true },
    parentEmail: { type: String, required: true },

    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    category: { type: String, required: true },

    bloodGroup: { type: String, required: true },
    aadharNumber: { type: String, required: true },

    state: { type: String, required: true },

    branchAllocated: { type: String, required: true },
    seatAllocatedThrough: { type: String, required: true },

    address: { type: String, required: true },
  },

  // 🔹 Step 3 — Academic
  academic: {
    class10: {
      board: String,
      year: Number,
      percentage: String,
    },

    class12: {
      board: String,
      stream: String,
      year: Number,
      percentage: String,
    },

    jeeRank: Number,
  },

  // 🔹 Step 4 — Documents
  documents: {
      photo: docField(),

      admissionLetter: docField(),

      class10Marksheet: docField(),

      class12Marksheet: docField(),

      jeeRankCard: docField(),

      casteCertificate: docField(),

      incomeCertificate: docField(),

      medicalCertificate: docField(),

      antiRaggingForm: docField(),

      performanceForm: docField(),

      aadharCard: docField(),

      feeReceipts: [docField()], // multiple receipts allowed
  },

  // 🔹 Step 5 — Declaration
  termsAccepted: {
    type: Boolean,
    required: true,
  },

  // 🔹 Workflow Status
  admissionStatus: {
    type: String,
    enum: [
      "pending_verification",
      "document_verified",
      "payment_pending",
      "admitted",
    ],
    default: "pending_verification",
  },

  payments: [
  {
    amount: { type: Number, required: true },

    receiptUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    remark: {
      type: String,
      default: ""
    },

    submittedAt: {
      type: Date,
      default: Date.now
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    verifiedAt: Date
  }
],

  fee: {
    firstSemTotal: Number, // e.g. 234500

    paidEarlier: Number, // from CSAB sheet
    institutePayable: Number, // auto-calculated

    paidNow: Number, // approved payments
    pendingVerification: Number,

    remaining: Number,
  },

  assignedVerifier: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

assignedAccountant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StudentProfile", studentProfileSchema);
