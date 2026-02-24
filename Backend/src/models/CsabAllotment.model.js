import mongoose from "mongoose";

const csabSchema = new mongoose.Schema(
  {
    // ===== Identification =====

    jeeApplicationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    fatherName: String,
    motherName: String,

    dob: Date,
    gender: String,

    category: String,
    pwd: String, // YES / NO

    stateOfEligibility: String,

    nationality: String,

    // ===== Institute & Program =====

    instituteCode: String,
    instituteName: String,

    branchCode: String,

    program: String,

    allottedCategory: String,

    rank: Number,

    quota: String, // AI / HS / OS
    seatPool: String, // Female-only / Gender-neutral / PwD

    round: String,

    // ===== Status =====

    status: String, // Retained / Upgraded / Fresh

    // ===== Fees Paid Earlier =====

    josaaSeatAcceptanceFee: {
      type: Number,
      default: 0,
    },

    partialAdmissionFee: {
      type: Number,
      default: 0,
    },

    participationFee: {
      type: Number,
      default: 0,
    },

    specialRoundFee: {
      type: Number,
      default: 0,
    },

    // ===== Contact Details =====

    mobileNo: String,
    emailId: String,
    address: String,

    // ===== System Fields =====

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    uploadBatch: String, // e.g. "Round-3-2026"
  },
  { timestamps: true },
);

export default mongoose.model("CsabAllotment", csabSchema);
