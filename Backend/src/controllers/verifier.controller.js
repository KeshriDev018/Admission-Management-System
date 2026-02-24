import Student from "../models/studentProfile.model.js";

const areAllDocumentsVerified = (docs) => {
  const allDocs = [
    ...Object.values(docs).filter((d) => !Array.isArray(d)),
    ...docs.feeReceipts,
  ];

  return allDocs.every((d) => d.status === "verified");
};
export const getMyPendingStudents = async (req, res) => {
  try {
    const students = await Student.find({
      assignedVerifier: req.user.id,
      admissionStatus: "pending_verification",
    })
      .select(
        "jeeApplicationNumber personal.fullName personal.category personal.branchAllocated createdAt",
      )
      .populate("user", "email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignedStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      assignedVerifier: req.user.id,
    }).populate("user", "name email");

    if (!student) {
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const verifyDocument = async (req, res) => {
  try {
    const { studentId, docType } = req.params;

    let student;

    if (req.user.role === "admin") {
      // Admin can access ANY student
      student = await Student.findById(studentId);
    } else {
      // Verifier can access ONLY assigned students
      student = await Student.findOne({
        _id: studentId,
        assignedVerifier: req.user.id,
      });
    }

    if (!student)
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });

    const doc = student.documents[docType];

    if (!doc)
      return res.status(400).json({
        message: "Invalid document type",
      });

    doc.status = "verified";
    doc.remark = "";
    doc.reuploaded = false;

    // 🔥 Auto-check all docs
    if (areAllDocumentsVerified(student.documents)) {
      student.admissionStatus = "document_verified";
    }

    await student.save();

    res.json({
      message: "Document verified",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectDocument = async (req, res) => {
  try {
    const { studentId, docType } = req.params;
    const { remark } = req.body;

    if (!remark)
      return res.status(400).json({
        message: "Rejection reason is required",
      });

   let student;

   if (req.user.role === "admin") {
     // Admin can access ANY student
     student = await Student.findById(studentId);
   } else {
     // Verifier can access ONLY assigned students
     student = await Student.findOne({
       _id: studentId,
       assignedVerifier: req.user.id,
     });
   }

    if (!student)
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });

    const doc = student.documents[docType];

    if (!doc)
      return res.status(400).json({
        message: "Invalid document type",
      });

    doc.status = "rejected";
    doc.remark = remark; // ⭐ REASON SAVED HERE

    student.admissionStatus = "pending_verification";

    await student.save();

    res.json({
      message: "Document rejected with reason",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyReceipt = async (req, res) => {
  try {
    const { studentId, index } = req.params;

    let student;

    if (req.user.role === "admin") {
      // Admin can access ANY student
      student = await Student.findById(studentId);
    } else {
      // Verifier can access ONLY assigned students
      student = await Student.findOne({
        _id: studentId,
        assignedVerifier: req.user.id,
      });
    }

    if (!student)
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });

    const receipt = student.documents.feeReceipts[index];

    if (!receipt)
      return res.status(400).json({
        message: "Invalid receipt index",
      });

    receipt.status = "verified";
    receipt.remark = "";
    receipt.reuploaded = false;

    // 🔥 Check all docs
    if (areAllDocumentsVerified(student.documents)) {
      student.admissionStatus = "document_verified";
    }

    await student.save();

    res.json({
      message: "Receipt verified successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectReceipt = async (req, res) => {
  try {
    const { studentId, index } = req.params;
    const { remark } = req.body;

    let student;

    if (req.user.role === "admin") {
      // Admin can access ANY student
      student = await Student.findById(studentId);
    } else {
      // Verifier can access ONLY assigned students
      student = await Student.findOne({
        _id: studentId,
        assignedVerifier: req.user.id,
      });
    }
    const receipt = student.documents.feeReceipts[index];

    if (!receipt)
      return res.status(400).json({
        message: "Invalid receipt",
      });

    receipt.status = "rejected";
    receipt.remark = remark;

    await student.save();

    res.json({ message: "Receipt rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};