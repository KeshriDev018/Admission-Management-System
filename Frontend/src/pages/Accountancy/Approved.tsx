import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  CheckCircle,
  DollarSign,
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

type ApprovedPayment = {
  id: string;
  studentName: string;
  rollNo: string;
  email: string;
  amount: number;
  approvalDate: string;
  paymentDate: string;
  studentReceiptUrl: string;
  studentReceiptName: string;
  collegeReceiptUrl: string;
  collegeReceiptName: string;
  program: string;
  department: string;
  approvedBy: string;
};

const Approved = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<ApprovedPayment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const approvedPayments: ApprovedPayment[] = [
    {
      id: "PAY-2025-001",
      studentName: "Rahul Sharma",
      rollNo: "IIITDWD-2025-001",
      email: "rahul.sharma@iiitdwd.ac.in",
      amount: 5000,
      approvalDate: "2025-12-15",
      paymentDate: "2025-12-10",
      studentReceiptUrl: "#",
      studentReceiptName: "rahul_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_001.pdf",
      program: "B.Tech CSE",
      department: "Computer Science",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-002",
      studentName: "Priya Patel",
      rollNo: "IIITDWD-2025-002",
      email: "priya.patel@iiitdwd.ac.in",
      amount: 4800,
      approvalDate: "2025-12-16",
      paymentDate: "2025-12-11",
      studentReceiptUrl: "#",
      studentReceiptName: "priya_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_002.pdf",
      program: "B.Tech ECE",
      department: "Electronics",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-003",
      studentName: "Amit Kumar",
      rollNo: "IIITDWD-2025-003",
      email: "amit.kumar@iiitdwd.ac.in",
      amount: 5200,
      approvalDate: "2025-12-17",
      paymentDate: "2025-12-12",
      studentReceiptUrl: "#",
      studentReceiptName: "amit_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_003.pdf",
      program: "B.Tech IT",
      department: "Information Technology",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-004",
      studentName: "Sneha Reddy",
      rollNo: "IIITDWD-2025-004",
      email: "sneha.reddy@iiitdwd.ac.in",
      amount: 4900,
      approvalDate: "2025-12-18",
      paymentDate: "2025-12-13",
      studentReceiptUrl: "#",
      studentReceiptName: "sneha_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_004.pdf",
      program: "B.Tech CSE",
      department: "Computer Science",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-005",
      studentName: "Vikram Singh",
      rollNo: "IIITDWD-2025-005",
      email: "vikram.singh@iiitdwd.ac.in",
      amount: 5100,
      approvalDate: "2025-12-19",
      paymentDate: "2025-12-14",
      studentReceiptUrl: "#",
      studentReceiptName: "vikram_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_005.pdf",
      program: "B.Tech ECE",
      department: "Electronics",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-006",
      studentName: "Anjali Mehta",
      rollNo: "IIITDWD-2025-006",
      email: "anjali.mehta@iiitdwd.ac.in",
      amount: 4700,
      approvalDate: "2025-12-20",
      paymentDate: "2025-12-15",
      studentReceiptUrl: "#",
      studentReceiptName: "anjali_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_006.pdf",
      program: "B.Tech IT",
      department: "Information Technology",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-007",
      studentName: "Rohit Gupta",
      rollNo: "IIITDWD-2025-007",
      email: "rohit.gupta@iiitdwd.ac.in",
      amount: 5300,
      approvalDate: "2025-12-21",
      paymentDate: "2025-12-16",
      studentReceiptUrl: "#",
      studentReceiptName: "rohit_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_007.pdf",
      program: "B.Tech CSE",
      department: "Computer Science",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-008",
      studentName: "Kavya Nair",
      rollNo: "IIITDWD-2025-008",
      email: "kavya.nair@iiitdwd.ac.in",
      amount: 4600,
      approvalDate: "2025-12-22",
      paymentDate: "2025-12-17",
      studentReceiptUrl: "#",
      studentReceiptName: "kavya_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_008.pdf",
      program: "B.Tech ECE",
      department: "Electronics",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-009",
      studentName: "Arjun Rao",
      rollNo: "IIITDWD-2025-009",
      email: "arjun.rao@iiitdwd.ac.in",
      amount: 5000,
      approvalDate: "2025-12-23",
      paymentDate: "2025-12-18",
      studentReceiptUrl: "#",
      studentReceiptName: "arjun_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_009.pdf",
      program: "B.Tech IT",
      department: "Information Technology",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-010",
      studentName: "Divya Iyer",
      rollNo: "IIITDWD-2025-010",
      email: "divya.iyer@iiitdwd.ac.in",
      amount: 4950,
      approvalDate: "2025-12-24",
      paymentDate: "2025-12-19",
      studentReceiptUrl: "#",
      studentReceiptName: "divya_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_010.pdf",
      program: "B.Tech CSE",
      department: "Computer Science",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-011",
      studentName: "Karan Joshi",
      rollNo: "IIITDWD-2025-011",
      email: "karan.joshi@iiitdwd.ac.in",
      amount: 5150,
      approvalDate: "2025-12-25",
      paymentDate: "2025-12-20",
      studentReceiptUrl: "#",
      studentReceiptName: "karan_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_011.pdf",
      program: "B.Tech ECE",
      department: "Electronics",
      approvedBy: "Admin User",
    },
    {
      id: "PAY-2025-012",
      studentName: "Meera Das",
      rollNo: "IIITDWD-2025-012",
      email: "meera.das@iiitdwd.ac.in",
      amount: 4850,
      approvalDate: "2025-12-26",
      paymentDate: "2025-12-21",
      studentReceiptUrl: "#",
      studentReceiptName: "meera_payment_receipt.pdf",
      collegeReceiptUrl: "#",
      collegeReceiptName: "college_receipt_012.pdf",
      program: "B.Tech IT",
      department: "Information Technology",
      approvedBy: "Admin User",
    },
  ];

  // Filter payments based on search query
  const filteredPayments = useMemo(() => {
    return approvedPayments.filter((payment) => {
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

  const handleViewPayment = (payment: ApprovedPayment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
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
              Approved Payments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all approved student fee payments
            </p>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
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

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Approved
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {approvedPayments.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    Total Amount Collected
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹
                    {approvedPayments
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-success" />
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
                      Approval Date
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
                        <span className="text-sm font-semibold text-success">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {formatDate(payment.approvalDate)}
                        </span>
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
                    No approved payments found
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
              Viewing approved payment for {selectedPayment?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6 mt-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20 px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Payment Approved
                </Badge>
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
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-xl font-bold text-success">
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
                      Approval Date
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedPayment.approvalDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved By</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPayment.approvedBy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipts Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">
                  Receipt Documents
                </h3>

                {/* Student Receipt */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Student Uploaded Receipt
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment.studentReceiptName}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(selectedPayment.studentReceiptUrl, "_blank")
                      }
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </div>

                {/* College Receipt */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          College Generated Receipt
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment.collegeReceiptName}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(selectedPayment.collegeReceiptUrl, "_blank")
                      }
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
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

export default Approved;
