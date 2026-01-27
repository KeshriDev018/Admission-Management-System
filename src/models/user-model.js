const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Account
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Personal
    fullName: String,
    fatherName: String,
    motherName: String,
    parentsContact: String,
    parentsEmail: String,
    dob: String,
    gender: String,
    category: String,
    bloodGroup: String,
    aadhar: {
      type: String,
      unique: true,
      sparse: true,
    },
    state: String,
    branch: String,
    seatAllocated: String,
    address: String,

    // Academic
    academic: {
      board10: String,
      year10: String,
      percentage10: String,
      board12: String,
      stream12: String,
      year12: String,
      percentage12: String,
      jeeRank: String,
    },

    // Documents
    documents: {
      photographUploaded: { type: Boolean, default: false },
      admissionLetterUploaded: { type: Boolean, default: false },
      marksheet10Uploaded: { type: Boolean, default: false },
      marksheet12Uploaded: { type: Boolean, default: false },
      jeeRankCardUploaded: { type: Boolean, default: false },
      casteCertificateUploaded: { type: Boolean, default: false },
      incomeCertificateUploaded: { type: Boolean, default: false },
      medicalCertificateUploaded: { type: Boolean, default: false },
      feePaymentReceiptsUploaded: {
        type: [Boolean],
        default: [],
      },
      antiRaggingFormUploaded: { type: Boolean, default: false },
      performance12FormUploaded: { type: Boolean, default: false },
      aadharPhotoUploaded: { type: Boolean, default: false },
    },

    // Terms
    termsAccepted: {
      type: Boolean,
      required: true,
    },

    // System
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
