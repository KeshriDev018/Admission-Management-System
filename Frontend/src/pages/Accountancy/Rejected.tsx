import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AccountancySidebar from "./Sidebar";

type RejectedPayment = {
  id: string;
  studentName: string;
  rollNo: string;
  email: string;
  amount: number;
  rejectionDate: string;
  paymentDate: string;
  receiptUrl: string;
  receiptName: string;
  rejectionRemark: string;
  program: string;
  department: string;
  rejectedBy: string;
  reuploadStatus: "Rejected" | "Reuploaded";
};

const Rejected = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Rejected" | "Reuploaded">(
    "Rejected"
  );
  const [selectedPayment, setSelectedPayment] =
    useState<RejectedPayment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const rejectedPayments: RejectedPayment[] = [
    {
      id: "PAY-2025-101",
      studentName: "Neha Kapoor",
      rollNo: "IIITDWD-2025-101",
      email: "neha.kapoor@iiitdwd.ac.in",
      amount: 5000,
      rejectionDate: "2025-12-28",
      paymentDate: "2025-12-25",
      receiptUrl: "#",
      receiptName: "neha_payment_receipt.pdf",
      rejectionRemark:
        "The receipt is not clear. Please upload a high-quality scan or photo of the payment receipt.",
      program: "B.Tech CSE",
      department: "Computer Science",
      rejectedBy: "Admin User",
      reuploadStatus: "Rejected",
    },
    {
      id: "PAY-2025-102",
      studentName: "Sanjay Verma",
      rollNo: "IIITDWD-2025-102",
      email: "sanjay.verma@iiitdwd.ac.in",
      amount: 4800,
      rejectionDate: "2025-12-27",
      paymentDate: "2025-12-24",
      receiptUrl: "#",
      receiptName: "sanjay_payment_receipt.pdf",
      rejectionRemark:
        "Amount mismatch. The receipt shows ₹4500 but the fee requirement is ₹4800. Please pay the remaining amount.",
      program: "B.Tech ECE",
      department: "Electronics",
      rejectedBy: "Admin User",
      reuploadStatus: "Reuploaded",
    },
    {
      id: "PAY-2025-103",
      studentName: "Pooja Desai",
      rollNo: "IIITDWD-2025-103",
      email: "pooja.desai@iiitdwd.ac.in",
      amount: 5200,
      rejectionDate: "2025-12-26",
      paymentDate: "2025-12-23",
      receiptUrl: "#",
      receiptName: "pooja_payment_receipt.pdf",
      rejectionRemark:
        "Transaction ID is not visible in the uploaded receipt. Please provide a clear receipt with transaction details.",
      program: "B.Tech IT",
      department: "Information Technology",
      rejectedBy: "Admin User",
      reuploadStatus: "Rejected",
    },
    {
      id: "PAY-2025-104",
      studentName: "Rajesh Kumar",
      rollNo: "IIITDWD-2025-104",
      email: "rajesh.kumar@iiitdwd.ac.in",
      amount: 4900,
      rejectionDate: "2025-12-29",
      paymentDate: "2025-12-26",
      receiptUrl: "#",
      receiptName: "rajesh_payment_receipt.pdf",
      rejectionRemark:
        "The uploaded document is not a valid payment receipt. Please upload the correct document.",
      program: "B.Tech CSE",
      department: "Computer Science",
      rejectedBy: "Admin User",
      reuploadStatus: "Reuploaded",
    },
    {
      id: "PAY-2025-105",
      studentName: "Ananya Singh",
      rollNo: "IIITDWD-2025-105",
      email: "ananya.singh@iiitdwd.ac.in",
      amount: 5100,
      rejectionDate: "2025-12-30",
      paymentDate: "2025-12-27",
      receiptUrl: "#",
      receiptName: "ananya_payment_receipt.pdf",
      rejectionRemark:
        "Date on the receipt does not match the payment date provided. Please verify and reupload.",
      program: "B.Tech ECE",
      department: "Electronics",
      rejectedBy: "Admin User",
      reuploadStatus: "Rejected",
    },
    {
      id: "PAY-2025-106",
      studentName: "Vikas Yadav",
      rollNo: "IIITDWD-2025-106",
      email: "vikas.yadav@iiitdwd.ac.in",
      amount: 4700,
      rejectionDate: "2025-12-25",
      paymentDate: "2025-12-22",
      receiptUrl: "#",
      receiptName: "vikas_payment_receipt.pdf",
      rejectionRemark:
        "Receipt appears to be edited. Please upload the original receipt from the payment gateway.",
      program: "B.Tech IT",
      department: "Information Technology",
      rejectedBy: "Admin User",
      reuploadStatus: "Reuploaded",
    },
    {
      id: "PAY-2025-107",
      studentName: "Shreya Agarwal",
      rollNo: "IIITDWD-2025-107",
      email: "shreya.agarwal@iiitdwd.ac.in",
      amount: 5300,
      rejectionDate: "2025-12-24",
      paymentDate: "2025-12-21",
      receiptUrl: "#",
      receiptName: "shreya_payment_receipt.pdf",
      rejectionRemark:
        "Bank name is not visible in the receipt. Please provide a complete receipt.",
      program: "B.Tech CSE",
      department: "Computer Science",
      rejectedBy: "Admin User",
      reuploadStatus: "Rejected",
    },
    {
      id: "PAY-2025-108",
      studentName: "Karthik Reddy",
      rollNo: "IIITDWD-2025-108",
      email: "karthik.reddy@iiitdwd.ac.in",
      amount: 4600,
      rejectionDate: "2025-12-23",
      paymentDate: "2025-12-20",
      receiptUrl: "#",
      receiptName: "karthik_payment_receipt.pdf",
      rejectionRemark:
        "Receipt is expired or older than 30 days. Please make a fresh payment.",
      program: "B.Tech ECE",
      department: "Electronics",
      rejectedBy: "Admin User",
      reuploadStatus: "Reuploaded",
    },
  ];

  // Filter by active tab
  const filteredByTab = useMemo(() => {
    return rejectedPayments.filter(
      (payment) => payment.reuploadStatus === activeTab
    );
  }, [activeTab]);

  // Filter payments based on search query
  const filteredPayments = useMemo(() => {
    return filteredByTab.filter((payment) => {
      const query = searchQuery.toLowerCase();
      return (
        payment.studentName.toLowerCase().includes(query) ||
        payment.rollNo.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query) ||
        payment.id.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, filteredByTab]);

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

  const handleViewPayment = (payment: RejectedPayment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleTabChange = (tab: "Rejected" | "Reuploaded") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const rejectedCount = rejectedPayments.filter(
    (p) => p.reuploadStatus === "Rejected"
  ).length;
  const reuploadedCount = rejectedPayments.filter(
    (p) => p.reuploadStatus === "Reuploaded"
  ).length;

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
              Rejected Payments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage rejected payment submissions and reuploaded documents
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "Rejected" ? "default" : "outline"}
              onClick={() => handleTabChange("Rejected")}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Rejected
              <Badge
                variant="secondary"
                className="ml-1 bg-background text-foreground"
              >
                {rejectedCount}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "Reuploaded" ? "default" : "outline"}
              onClick={() => handleTabChange("Reuploaded")}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reuploaded
              <Badge
                variant="secondary"
                className="ml-1 bg-background text-foreground"
              >
                {reuploadedCount}
              </Badge>
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, roll number, email, or payment ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "Rejected"
                      ? "Awaiting Reupload"
                      : "Ready for Review"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredByTab.length}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeTab === "Rejected"
                      ? "bg-destructive/10"
                      : "bg-warning/10"
                  }`}
                >
                  {activeTab === "Rejected" ? (
                    <XCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <RefreshCw className="w-5 h-5 text-warning" />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Results Found</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredPayments.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Rejected
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {rejectedPayments.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Page</p>
                  <p className="text-2xl font-bold text-foreground">
                    {currentPage} / {totalPages || 1}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Payment ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Student Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Roll Number
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Program
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Rejection Date
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">
                          {payment.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {payment.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {payment.rollNo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-foreground">
                            {payment.program}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {formatDate(payment.rejectionDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.reuploadStatus === "Rejected" ? (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                            Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            Reuploaded
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPayment(payment)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {paginatedPayments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No {activeTab.toLowerCase()} payments found
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mt-6"
            >
              <p className="text-sm text-muted-foreground">
                Showing {startIdx + 1} to{" "}
                {Math.min(endIdx, filteredPayments.length)} of{" "}
                {filteredPayments.length} payments
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* View Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Payment Details</DialogTitle>
            <DialogDescription>
              Viewing rejected payment for {selectedPayment?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 mt-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {selectedPayment.reuploadStatus === "Rejected" ? (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1">
                    <XCircle className="w-4 h-4 mr-1" />
                    Payment Rejected
                  </Badge>
                ) : (
                  <Badge className="bg-warning/10 text-warning border-warning/20 px-3 py-1">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Document Reuploaded
                  </Badge>
                )}
              </div>

              {/* Student Information */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground text-lg mb-3">
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.rollNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Program</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.program}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground text-lg mb-3">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Amount Submitted
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      ₹{selectedPayment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Date
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedPayment.paymentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Rejection Date
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedPayment.rejectionDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected By</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.rejectedBy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection Remark */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive text-sm mb-2">
                      Reason for Rejection
                    </h3>
                    <p className="text-sm text-foreground">
                      {selectedPayment.rejectionRemark}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipt Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-lg">
                  Uploaded Receipt
                </h3>

                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Student Payment Receipt
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment.receiptName}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(selectedPayment.receiptUrl, "_blank")
                      }
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Document
                    </Button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rejected;
