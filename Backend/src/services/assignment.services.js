import User from "../models/user.model.js";
import Student from "../models/studentProfile.model.js";

export const assignVerifier = async () => {
  const verifiers = await User.find({ role: "verifier", isActive: true });

  if (!verifiers.length) throw new Error("No active verifiers available");

  let selected = null;
  let minLoad = Infinity;

  for (const v of verifiers) {
    const load = await Student.countDocuments({
      assignedVerifier: v._id,
      admissionStatus: { $ne: "admitted" },
    });

    if (load < minLoad) {
      minLoad = load;
      selected = v;
    }
  }

  return selected._id;
};

export const assignAccountant = async () => {
  const accountants = await User.find({
    role: "accountancy",
    isActive: true,
  });

  if (!accountants.length)
    throw new Error("No active accountancy staff available");

  let selected = null;
  let minLoad = Infinity;

  for (const a of accountants) {
    const load = await Student.countDocuments({
      assignedAccountant: a._id,
      admissionStatus: { $ne: "admitted" },
    });

    if (load < minLoad) {
      minLoad = load;
      selected = a;
    }
  }

  return selected._id;
};
