import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  GraduationCap,
  FileText,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { accountancyAPI } from "@/lib/api";

interface StudentDetailsDialogProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const StudentDetailsDialog = ({
  student,
  isOpen,
  onClose,
  onRefresh,
}: StudentDetailsDialogProps) => {
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null,
  );
  const [rejectRemark, setRejectRemark] = useState("");
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      setProcessingPaymentId(paymentId);
      await accountancyAPI.approvePayment(student._id, paymentId);
      toast.success("Payment approved successfully");
      onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Failed to approve payment:", error);
      toast.error(error.response?.data?.message || "Failed to approve payment");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!rejectRemark.trim()) {
      toast.error("Please provide a remark for rejection");
      return;
    }

    try {
      setProcessingPaymentId(paymentId);
      await accountancyAPI.rejectPayment(student._id, paymentId, rejectRemark);
      toast.success("Payment rejected with remarks");
      setRejectRemark("");
      setShowRejectInput(null);
      onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Failed to reject payment:", error);
      toast.error(error.response?.data?.message || "Failed to reject payment");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Student Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Student Info Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {student.personal?.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {student.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  JEE Application Number
                </p>
                <p className="font-medium">
                  {student.jeeApplicationNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {student.personal?.branchAllocated || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">
                  {student.personal?.category || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Summary Section */}
          <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fee Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  First Semester Total
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(student.fee?.firstSemTotal || 0)}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Paid Earlier
                </p>
                <p className="text-lg font-bold text-gray-600">
                  {formatCurrency(student.fee?.paidEarlier || 0)}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Institute Payable
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(student.fee?.institutePayable || 0)}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Paid Now</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(student.fee?.paidNow || 0)}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Pending Verification
                </p>
                <p className="text-lg font-bold text-yellow-600">
                  {formatCurrency(student.fee?.pendingVerification || 0)}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(student.fee?.remaining || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment History Timeline */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Payment History
            </h3>

            {!student.payments || student.payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payment records found
              </p>
            ) : (
              <div className="space-y-4">
                {student.payments.map((payment: any, index: number) => (
                  <motion.div
                    key={payment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${
                      payment.status === "pending"
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : payment.status === "approved"
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-bold">
                            {formatCurrency(payment.amount)}
                          </p>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {formatDate(payment.submittedAt)}
                        </p>
                      </div>
                      {payment.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprovePayment(payment._id)}
                            disabled={processingPaymentId === payment._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingPaymentId === payment._id ? (
                              <>
                                <Clock className="w-4 h-4 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowRejectInput(payment._id)}
                            disabled={processingPaymentId === payment._id}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Receipt Preview */}
                    {payment.receiptUrl && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-2">
                          Payment Receipt:
                        </p>
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          View Receipt
                        </a>
                      </div>
                    )}

                    {/* Remark for rejected payments */}
                    {payment.status === "rejected" && payment.remark && (
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {payment.remark}
                        </p>
                      </div>
                    )}

                    {/* Verified info */}
                    {payment.status !== "pending" && payment.verifiedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Verified on {formatDate(payment.verifiedAt)}
                      </p>
                    )}

                    {/* Reject input */}
                    {showRejectInput === payment._id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          placeholder="Enter rejection reason..."
                          value={rejectRemark}
                          onChange={(e) => setRejectRemark(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectPayment(payment._id)}
                            disabled={processingPaymentId === payment._id}
                          >
                            Confirm Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowRejectInput(null);
                              setRejectRemark("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;
