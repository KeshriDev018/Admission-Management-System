import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  DollarSign,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AccountancySidebar from "./Sidebar";

type PendingPayment = {
  id: string;
  studentName: string;
  rollNo: string;
  email: string;
  amount: number;
  paymentDate: string;
  receiptUrl: string;
  receiptName: string;
  program: string;
  department: string;
};

const Pending = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [correctedAmount, setCorrectedAmount] = useState("");
  const [rejectionRemark, setRejectionRemark] = useState("");
  const [collegeReceipt, setCollegeReceipt] = useState<File | null>(null);
  const [collegeReceiptName, setCollegeReceiptName] = useState("");
  const itemsPerPage = 10;

  // Demo pending payments data
  const pendingPayments: PendingPayment[] = [
    {
      id: "pay-001",
      studentName: "Rajesh Kumar",
      rollNo: "CSE-001",
      email: "rajesh.kumar@student.com",
      amount: 5000,
      paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_rajesh_001.pdf",
      program: "B.Tech",
      department: "Computer Science",
    },
    {
      id: "pay-002",
      studentName: "Priya Sharma",
      rollNo: "ENG-002",
      email: "priya.sharma@student.com",
      amount: 4500,
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_priya_002.pdf",
      program: "B.Tech",
      department: "Electronics",
    },
    {
      id: "pay-003",
      studentName: "Amit Patel",
      rollNo: "CSE-003",
      email: "amit.patel@student.com",
      amount: 5000,
      paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_amit_003.pdf",
      program: "B.Sc",
      department: "Computer Science",
    },
    {
      id: "pay-004",
      studentName: "Neha Gupta",
      rollNo: "ME-004",
      email: "neha.gupta@student.com",
      amount: 4800,
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_neha_004.pdf",
      program: "B.Tech",
      department: "Mechanical",
    },
    {
      id: "pay-005",
      studentName: "Vikram Singh",
      rollNo: "EC-005",
      email: "vikram.singh@student.com",
      amount: 5200,
      paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_vikram_005.pdf",
      program: "B.Tech",
      department: "Electronics",
    },
    {
      id: "pay-006",
      studentName: "Sneha Reddy",
      rollNo: "CSE-006",
      email: "sneha.reddy@student.com",
      amount: 5000,
      paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_sneha_006.pdf",
      program: "B.Tech",
      department: "Computer Science",
    },
    {
      id: "pay-007",
      studentName: "Arjun Verma",
      rollNo: "ME-007",
      email: "arjun.verma@student.com",
      amount: 4700,
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_arjun_007.pdf",
      program: "Diploma",
      department: "Mechanical",
    },
    {
      id: "pay-008",
      studentName: "Divya Nair",
      rollNo: "CSE-008",
      email: "divya.nair@student.com",
      amount: 5000,
      paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_divya_008.pdf",
      program: "B.Tech",
      department: "Computer Science",
    },
    {
      id: "pay-009",
      studentName: "Rohit Yadav",
      rollNo: "ENG-009",
      email: "rohit.yadav@student.com",
      amount: 4900,
      paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_rohit_009.pdf",
      program: "B.Tech",
      department: "Electronics",
    },
    {
      id: "pay-010",
      studentName: "Ananya Das",
      rollNo: "CSE-010",
      email: "ananya.das@student.com",
      amount: 5100,
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_ananya_010.pdf",
      program: "B.Sc",
      department: "Computer Science",
    },
    {
      id: "pay-011",
      studentName: "Sanjay Kumar",
      rollNo: "ME-011",
      email: "sanjay.kumar@student.com",
      amount: 4600,
      paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_sanjay_011.pdf",
      program: "B.Tech",
      department: "Mechanical",
    },
    {
      id: "pay-012",
      studentName: "Pooja Mishra",
      rollNo: "CSE-012",
      email: "pooja.mishra@student.com",
      amount: 5000,
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      receiptUrl: "#",
      receiptName: "receipt_pooja_012.pdf",
      program: "B.Tech",
      department: "Computer Science",
    },
  ];

  // Filter payments based on search query
  const filteredPayments = useMemo(() => {
    return pendingPayments.filter((payment) => {
      const query = searchQuery.toLowerCase();
      return (
        payment.studentName.toLowerCase().includes(query) ||
        payment.rollNo.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query) ||
        payment.id.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Paginate payments
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIdx, endIdx);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewPayment = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setCorrectedAmount(payment.amount.toString());
    setRejectionRemark("");
    setCollegeReceipt(null);
    setCollegeReceiptName("");
    setIsDialogOpen(true);
  };

  const handleCollegeReceiptUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, PNG, or JPG file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setCollegeReceipt(file);
    setCollegeReceiptName(file.name);
    toast.success("College receipt uploaded successfully");
  };

  const handleApprove = () => {
    if (!collegeReceipt) {
      toast.error("Please upload college receipt before approving");
      return;
    }

    const finalAmount = parseFloat(correctedAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.success(
      `Payment of ₹${finalAmount} approved for ${selectedPayment?.studentName}. College receipt generated.`
    );
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    if (!rejectionRemark.trim()) {
      toast.error("Please add a remark for rejection");
      return;
    }

    toast.success(
      `Payment rejected for ${selectedPayment?.studentName}. Student notified with remarks.`
    );
    setIsDialogOpen(false);
  };

  const handleUpdateAmount = () => {
    const finalAmount = parseFloat(correctedAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.success(
      `Amount updated to ₹${finalAmount} for ${selectedPayment?.studentName}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AccountancySidebar />

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Pending Payments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve student fee payments
            </p>
          </div>

          {/* Search and Stats */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll no, email, or payment ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Total Pending
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingPayments.length}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Results Found
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredPayments.length}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Page</div>
                <div className="text-2xl font-bold">
                  {totalPages > 0 ? currentPage : 0} / {totalPages}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-3 font-semibold">Payment ID</th>
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Roll No</th>
                    <th className="pb-3 font-semibold">Program</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.length === 0 ? (
                    <tr>
                      <td
                        className="py-8 text-center text-muted-foreground"
                        colSpan={7}
                      >
                        No pending payments found.
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((payment, idx) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 text-sm font-mono">{payment.id}</td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{payment.rollNo}</td>
                        <td className="py-4">
                          <Badge variant="outline">{payment.program}</Badge>
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-green-600">
                            ₹{payment.amount}
                          </span>
                        </td>
                        <td className="py-4 text-sm">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPayment(payment)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 flex items-center justify-between"
            >
              <div className="text-sm text-muted-foreground">
                Showing {startIdx + 1}-
                {Math.min(endIdx, filteredPayments.length)} of{" "}
                {filteredPayments.length} payments
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-sm text-muted-foreground">
                    {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Payment Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Review Payment - {selectedPayment?.studentName}
            </DialogTitle>
            <DialogDescription>
              Payment ID: {selectedPayment?.id} | Roll No:{" "}
              {selectedPayment?.rollNo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Student Info */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedPayment?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedPayment?.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Program</p>
                  <p className="font-medium">{selectedPayment?.program}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Date</p>
                  <p className="font-medium">
                    {selectedPayment && formatDate(selectedPayment.paymentDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Receipt */}
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                Student Uploaded Receipt
              </p>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">
                      {selectedPayment?.receiptName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Amount: ₹{selectedPayment?.amount}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(selectedPayment?.receiptUrl, "_blank")
                  }
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Receipt
                </Button>
              </div>
            </div>

            {/* Amount Correction */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Correct Amount (if needed)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={correctedAmount}
                  onChange={(e) => setCorrectedAmount(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleUpdateAmount} variant="outline">
                  Update Amount
                </Button>
              </div>
            </div>

            {/* College Receipt Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Upload College Receipt (Required for Approval)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleCollegeReceiptUpload}
                  className="hidden"
                  id="college-receipt-upload"
                />
                <label
                  htmlFor="college-receipt-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload college receipt (PDF, PNG, JPG - Max 5MB)
                  </p>
                  {collegeReceiptName && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {collegeReceiptName} uploaded
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Rejection Remark */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Rejection Remark (if rejecting)
              </label>
              <Textarea
                placeholder="Add detailed remarks for payment rejection..."
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                className="text-sm min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Payment
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Payment
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Approve to confirm payment and generate college receipt, or reject
              with remarks to notify student.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pending;
