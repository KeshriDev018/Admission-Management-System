import StudentSidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { studentAPI } from "@/lib/api";

interface Payment {
  amount: number;
  receiptUrl: string;
  status: "pending" | "approved" | "rejected";
  remark?: string;
  submittedAt: string;
}

const FeePayments = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [amount, setAmount] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileData = await studentAPI.getProfile();
      console.log("=== Profile Data ===", profileData);
      console.log("Payments Array:", profileData.payments);
      console.log("Fee Object:", profileData.fee);
      setProfile(profileData);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast.error(
        error.response?.data?.message || "Failed to load fee information",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, PNG, or JPG file");
      e.target.value = "";
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    toast.success(`${file.name} selected`);
  };

  const handlePaymentSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload payment receipt");
      return;
    }

    try {
      setUploading(true);
      await studentAPI.uploadPayment(Number(amount), selectedFile);
      toast.success("Payment submitted successfully! Awaiting verification.");

      // Reset form
      setAmount("");
      setSelectedFile(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error("Payment upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setUploading(false);
    }
  };

  const handleSBIPay = () => {
    const ref = encodeURIComponent(`sbi-${Date.now()}`);
    const url = `https://retail.onlinesbi.sbi/Retail/Payment?amount=${Number(amount || 0)}&ref=${ref}`;
    window.open(url, "_blank");
    toast.info(
      "SBI payment page opened. After payment, upload the receipt here.",
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading fee information...</p>
          </div>
        </main>
      </div>
    );
  }

  const payments: Payment[] = profile?.payments || [];

  // Total paid = paidEarlier (from CSAB) + paidNow (approved payments)
  const paidEarlier = profile?.fee?.paidEarlier || 0;
  const paidNow =
    profile?.fee?.paidNow ??
    payments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = paidEarlier + paidNow;

  console.log("Total Paid Calculation:", {
    paidEarlier,
    paidNow,
    totalPaid,
    paymentsCount: payments.length,
    approvedPayments: payments.filter((p) => p.status === "approved"),
  });

  const totalPending = profile?.fee?.pendingVerification || 0;
  const remaining = profile?.fee?.remaining || 0;
  const firstSemTotal = profile?.fee?.firstSemTotal || 0;

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Fee Payments
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your fee payments and track transactions
            </p>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Fee Summary */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Total Fee
                </div>
                <div className="text-lg sm:text-xl font-bold">
                  ₹{firstSemTotal.toLocaleString()}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Paid
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Pending Verification
                </div>
                <div className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  ₹{totalPending.toLocaleString()}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Remaining
                </div>
                <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{remaining.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Payment Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 sm:p-6 mt-4 shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Payment Journey
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Follow these simple steps to complete your payment
                </p>
              </div>

              <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 rounded-full opacity-30" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {[
                    {
                      title: "1. Open SBI",
                      desc: "Click 'Pay via SBI' to open the payment portal",
                      icon: "💳",
                    },
                    {
                      title: "2. Complete Payment",
                      desc: "Pay the amount securely on SBI",
                      icon: "✓",
                    },
                    {
                      title: "3. Upload Receipt",
                      desc: "Download and upload your receipt here",
                      icon: "📄",
                    },
                    {
                      title: "4. Payment Approved",
                      desc: "Accountancy verifies and approves your payment",
                      icon: "✅",
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{
                        scale: 1.05,
                        y: -6,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: i * 0.1,
                      }}
                      className="p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group h-36 sm:h-40 flex flex-col bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />

                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="text-2xl sm:text-3xl mb-2 inline-block transition-opacity duration-300 opacity-60 group-hover:opacity-100">
                            {s.icon}
                          </div>
                          <div className="font-semibold text-sm mb-1 transition-colors duration-300 text-foreground group-hover:text-slate-900 dark:group-hover:text-slate-100">
                            {s.title}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Pay via SBI Section */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
              Pay via SBI
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Click the button below to open the SBI payment portal. After
              completing your payment, download the receipt and upload it here
              to record the transaction.
            </p>
            <Button
              size="lg"
              className="bg-primary text-white w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
              onClick={handleSBIPay}
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Open SBI
              Payment Portal
            </Button>
          </motion.div>

          {/* Record Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
              Record Payment
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
                  Amount Paid (INR)
                </label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount paid"
                  inputMode="numeric"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
                  Upload Receipt (PDF / JPG / PNG, max 5MB)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full text-sm h-10"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                </Button>
                {selectedFile && (
                  <div className="mt-2 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ {selectedFile.name} selected
                  </div>
                )}
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-white text-sm sm:text-base h-10 sm:h-11"
                onClick={handlePaymentSubmit}
                disabled={uploading || !selectedFile || !amount}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Payment
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
              Payment History
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Transactions with status updates from accountancy
            </p>

            {payments.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  No payments yet. Use 'Pay via SBI' then upload the receipt to
                  record a payment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full table-auto min-w-[600px]">
                  <thead>
                    <tr className="text-left text-xs sm:text-sm text-muted-foreground">
                      <th className="pb-2 px-2 sm:px-0">Date</th>
                      <th className="pb-2 px-2 sm:px-0">Amount</th>
                      <th className="pb-2 px-2 sm:px-0">Status</th>
                      <th className="pb-2 px-2 sm:px-0">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-muted/50 cursor-pointer"
                      >
                        <td className="py-2 sm:py-3 w-32 sm:w-48 text-xs sm:text-sm px-2 sm:px-0">
                          {new Date(payment.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm px-2 sm:px-0">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-0">
                          {getPaymentStatusBadge(payment.status)}
                          {payment.status === "rejected" && payment.remark && (
                            <div className="text-xs text-destructive mt-1 flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{payment.remark}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 sm:h-8 px-2"
                            onClick={() =>
                              window.open(payment.receiptUrl, "_blank")
                            }
                          >
                            <Download className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FeePayments;
