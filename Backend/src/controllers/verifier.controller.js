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
        "jeeApplicationNumber personal.fullName personal.category personal.branchAllocated admissionStatus documents createdAt",
      )
      .populate("user", "email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyVerifiedStudents = async (req, res) => {
  try {
    const students = await Student.find({
      assignedVerifier: req.user.id,
      admissionStatus: "document_verified",
    })
      .select(
        "jeeApplicationNumber personal.fullName personal.category personal.branchAllocated admissionStatus documents createdAt",
      )
      .populate("user", "email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedNotReuploadedStudents = async (req, res) => {
  try {
    const students = await Student.find({
      assignedVerifier: req.user.id,
      $or: [
        {
          $and: [
            { "documents.photo.status": "rejected" },
            {
              $or: [
                { "documents.photo.reuploaded": false },
                { "documents.photo.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.admissionLetter.status": "rejected" },
            {
              $or: [
                { "documents.admissionLetter.reuploaded": false },
                { "documents.admissionLetter.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.class10Marksheet.status": "rejected" },
            {
              $or: [
                { "documents.class10Marksheet.reuploaded": false },
                { "documents.class10Marksheet.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.class12Marksheet.status": "rejected" },
            {
              $or: [
                { "documents.class12Marksheet.reuploaded": false },
                { "documents.class12Marksheet.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.jeeRankCard.status": "rejected" },
            {
              $or: [
                { "documents.jeeRankCard.reuploaded": false },
                { "documents.jeeRankCard.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.casteCertificate.status": "rejected" },
            {
              $or: [
                { "documents.casteCertificate.reuploaded": false },
                { "documents.casteCertificate.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.incomeCertificate.status": "rejected" },
            {
              $or: [
                { "documents.incomeCertificate.reuploaded": false },
                {
                  "documents.incomeCertificate.reuploaded": { $exists: false },
                },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.medicalCertificate.status": "rejected" },
            {
              $or: [
                { "documents.medicalCertificate.reuploaded": false },
                {
                  "documents.medicalCertificate.reuploaded": { $exists: false },
                },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.antiRaggingForm.status": "rejected" },
            {
              $or: [
                { "documents.antiRaggingForm.reuploaded": false },
                { "documents.antiRaggingForm.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.performanceForm.status": "rejected" },
            {
              $or: [
                { "documents.performanceForm.reuploaded": false },
                { "documents.performanceForm.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          $and: [
            { "documents.aadharCard.status": "rejected" },
            {
              $or: [
                { "documents.aadharCard.reuploaded": false },
                { "documents.aadharCard.reuploaded": { $exists: false } },
              ],
            },
          ],
        },
        {
          "documents.feeReceipts": {
            $elemMatch: {
              status: "rejected",
              $or: [{ reuploaded: false }, { reuploaded: { $exists: false } }],
            },
          },
        },
      ],
    })
      .select(
        "jeeApplicationNumber personal.fullName personal.category personal.branchAllocated documents createdAt",
      )
      .populate("user", "email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRejectedReuploadedStudents = async (req, res) => {
  try {
    const students = await Student.find({
      assignedVerifier: req.user.id,
      $or: [
        {
          $and: [
            { "documents.photo.status": "rejected" },
            { "documents.photo.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.admissionLetter.status": "rejected" },
            { "documents.admissionLetter.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.class10Marksheet.status": "rejected" },
            { "documents.class10Marksheet.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.class12Marksheet.status": "rejected" },
            { "documents.class12Marksheet.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.jeeRankCard.status": "rejected" },
            { "documents.jeeRankCard.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.casteCertificate.status": "rejected" },
            { "documents.casteCertificate.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.incomeCertificate.status": "rejected" },
            { "documents.incomeCertificate.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.medicalCertificate.status": "rejected" },
            { "documents.medicalCertificate.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.antiRaggingForm.status": "rejected" },
            { "documents.antiRaggingForm.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.performanceForm.status": "rejected" },
            { "documents.performanceForm.reuploaded": true },
          ],
        },
        {
          $and: [
            { "documents.aadharCard.status": "rejected" },
            { "documents.aadharCard.reuploaded": true },
          ],
        },
        {
          "documents.feeReceipts": {
            $elemMatch: {
              status: "rejected",
              reuploaded: true,
            },
          },
        },
      ],
    })
      .select(
        "jeeApplicationNumber personal.fullName personal.category personal.branchAllocated documents createdAt",
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
    doc.reuploaded = false; // Reset reuploaded flag on rejection

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
    receipt.reuploaded = false; // Reset reuploaded flag on rejection

    await student.save();

    res.json({ message: "Receipt rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
