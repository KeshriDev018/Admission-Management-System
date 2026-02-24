import Student from "../models/studentProfile.model.js";

export const getMyPaymentStudents = async (req, res) => {
  try {
    const students = await Student.find({
      assignedAccountant: req.user.id,
      admissionStatus: "payment_pending",
    })
      .select(
        "jeeApplicationNumber personal.fullName personal.branchAllocated fee createdAt",
      )
      .populate("user", "email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      assignedAccountant: req.user.id,
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

export const approvePayment = async (req, res) => {
  try {
    const { studentId, paymentId } = req.params;

    // 🔒 Ownership check (admin override allowed)
    const query =
      req.user.role === "admin"
        ? { _id: studentId }
        : { _id: studentId, assignedAccountant: req.user.id };

    const studentExists = await Student.exists(query);

    if (!studentExists)
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });

    // 🧠 ATOMIC UPDATE — approve ONLY if still pending
    const result = await Student.updateOne(
      {
        _id: studentId,
        "payments._id": paymentId,
        "payments.status": "pending",
      },
      {
        $set: {
          "payments.$.status": "approved",
          "payments.$.verifiedBy": req.user.id,
          "payments.$.verifiedAt": new Date(),
        },
      },
    );

    // ❌ If nothing updated → already processed or invalid
    if (result.modifiedCount === 0) {
      const exists = await Student.exists({
        _id: studentId,
        "payments._id": paymentId,
      });

      if (!exists)
        return res.status(404).json({
          message: "Payment record not found",
        });

      return res.status(400).json({
        message: "Payment already processed",
      });
    }

    // 🔄 Re-fetch updated student
    const student = await Student.findById(studentId);

    // 🧮 Recalculate totals from APPROVED payments ONLY
    const approvedTotal = student.payments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + p.amount, 0);

    student.fee.paidNow = approvedTotal;

    student.fee.remaining = Math.max(
      student.fee.institutePayable - approvedTotal,
      0,
    );

    // 🏁 Final admission status
    if (student.fee.remaining === 0) {
      student.admissionStatus = "admitted";
    } else {
      student.admissionStatus = "payment_pending";
    }

    await student.save();

    res.json({
      message: "Payment approved successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { studentId, paymentId } = req.params;
    const { remark } = req.body;

    let student;

    if (req.user.role === "admin") {
      // Admin can access ANY student
      student = await Student.findById(studentId);
    } else {
      // Verifier can access ONLY assigned students
      student = await Student.findOne({
        _id: studentId,
        assignedAccountant: req.user.id,
      });
    }

    if (!student)
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });

    const payment = student.payments.id(paymentId);

    if (!payment)
      return res.status(404).json({
        message: "Payment record not found",
      });

    // ❗ Prevent re-processing
    if (payment.status !== "pending")
      return res.status(400).json({
        message: "Payment already processed",
      });

    const amount = payment.amount;

    // ❌ Reject payment
    payment.status = "rejected";
    payment.remark = remark || "Payment rejected";
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();

    // 🔥 Update fee summary
    student.fee.pendingVerification -= amount;

    // Stay in payment stage
    student.admissionStatus = "payment_pending";

    await student.save();

    res.json({
      message: "Payment rejected",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};