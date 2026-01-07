import StudentSidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Download,
  Link as LinkIcon,
  Upload,
  Clock,
  CheckCircle,
} from "lucide-react";

type Payment = {
  id: string;
  date: string;
  amount: number;
  mode: string;
  status: "Initiated" | "Pending" | "Approved" | "Rejected" | "Success";
  receiptName?: string;
  receiptUrl?: string;
};

const STORAGE_KEY = "pams_fee_payments_v1";

const FeePayments = () => {
  const TOTAL_FEE = 20000; // demo total fee
  const [amount, setAmount] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Payment[] = JSON.parse(raw);
        setPayments(parsed);
        // Re-schedule auto-approve for any pending payments (simulate accountancy)
        parsed.forEach((p) => {
          if (p.status === "Pending") {
            simulateApproval(p.id);
          }
        });
      } catch (e) {
        console.error("Failed to parse payments from storage", e);
      }
    } else {
      // seed demo data
      const seed: Payment[] = [
        {
          id: "t-1",
          date: new Date().toISOString(),
          amount: 5000,
          mode: "Online",
          status: "Success",
        },
      ];
      setPayments(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const totalPaid = payments
    .filter((p) => p.status === "Success" || p.status === "Approved")
    .reduce((s, p) => s + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "Pending" || p.status === "Initiated")
    .reduce((s, p) => s + p.amount, 0);

  const remaining = TOTAL_FEE - totalPaid;
  const remainingAfterVerification = TOTAL_FEE - (totalPaid + totalPending);

  const savePayment = (p: Payment) => {
    setPayments((prev) => {
      const next = [p, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    // focus timeline on newly saved payment
    setSelectedPaymentId(p.id);
  };
  /**
   * Placeholder: send receipt/payment metadata to the server for verification/storage.
   * Replace this with an API call (e.g., POST /api/payments) when backend is available.
   */
  const sendReceiptToServer = async (p: Payment) => {
    // TODO: implement API integration. For demo we simply resolve immediately.
    return Promise.resolve({ ok: true, id: p.id });
  };

  /**
   * Placeholder: Poll server for approval status if using async verification.
   * Current implementation simulates approval locally via `simulateApproval`.
   */
  const pollApprovalStatus = async (paymentId: string) => {
    // TODO: implement server-polling using fetch or react-query
    return Promise.resolve({ status: "Pending" });
  };

  const handleSbiPay = () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Enter amount",
        description:
          "Please enter a valid amount before proceeding to payment.",
      });
      return;
    }

    // Open SBI payment page in a new tab with amount as reference. DO NOT record a payment entry until receipt is uploaded.
    const ref = encodeURIComponent(`sbi-${Date.now()}`);
    const url = `https://retail.onlinesbi.sbi/Retail/Payment?amount=${Number(
      amount
    )}&ref=${ref}`;
    window.open(url, "_blank");

    toast({
      title: "SBI Payment Page Opened",
      description:
        "The SBI payment page opened in a new tab. After completing payment, download the receipt and upload it here using 'Upload Proof' to record the payment.",
    });
  };

  const handleUploadReceiptClick = () => {
    fileRef.current?.click();
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // validate file type and size (PDF/JPG/PNG, max 5MB)
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(f.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, PNG or JPG file (max 5MB).",
      });
      e.currentTarget.value = "";
      return;
    }
    const MAX = 5 * 1024 * 1024; // 5MB
    if (f.size > MAX) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
      });
      e.currentTarget.value = "";
      return;
    }

    // Store the file for later submission
    setSelectedFile(f);
    setSelectedFileName(f.name);
    toast({
      title: "File selected",
      description: `${f.name} selected. Click Submit Payment to record the payment.`,
    });
  };

  const submitPayment = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please choose a file before submitting.",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Enter amount",
        description:
          "Please enter the amount you paid before submitting the receipt.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const id = `r-${Date.now()}`;
      const p: Payment = {
        id,
        date: new Date().toISOString(),
        amount: Number(amount),
        mode: "SBI Receipt",
        status: "Pending",
        receiptName: selectedFile.name,
        receiptUrl: url,
      };
      savePayment(p);
      toast({
        title: "Receipt uploaded",
        description:
          "Your receipt has been uploaded and is pending verification.",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedFileName("");
      setAmount("");
      if (fileRef.current) fileRef.current.value = "";

      // simulate accountancy approval after a short delay
      simulateApproval(id);
    };
    reader.readAsDataURL(selectedFile);
  };

  const simulateApproval = (id: string) => {
    // simulate variable delay
    const delay = 8000 + Math.floor(Math.random() * 5000);
    setTimeout(() => {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.id === id && p.status === "Pending") {
            toast({
              title: "Payment approved",
              description: `Payment of ₹${p.amount} verified by accountancy.`,
            });
            return { ...p, status: "Approved" };
          }
          return p;
        })
      );
    }, delay);
  };

  const downloadFeeStructure = () => {
    const content = `Sample Fee Structure for PAMS\n\nPrograms:\n- B.Tech: ₹20000/year\n- B.Sc: ₹15000/year\n- Diploma: ₹10000/year\n\nThis is a demo fee structure.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PAMS_fee_structure.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Fee structure downloaded." });
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const downloadReceipt = (p: Payment) => {
    if (!p.receiptUrl) return;
    const a = document.createElement("a");
    a.href = p.receiptUrl;
    a.download = p.receiptName || `receipt-${p.id}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadCollegeReceipt = (p: Payment) => {
    // Generate a college fee receipt as PDF text content
    const receiptContent = `
================================================================================
                         COLLEGE FEE RECEIPT
================================================================================

Receipt No: ${p.id}
Date: ${formatDate(p.date)}

STUDENT DETAILS:
Name: [Student Name]
Roll No: [Roll Number]
Email: [Student Email]

PAYMENT DETAILS:
Amount Paid: ₹${p.amount}
Payment Mode: ${p.mode}
Transaction ID: ${p.id}
Status: ${p.status}

BREAKDOWN:
Total Fee: ₹${TOTAL_FEE}
Amount Paid: ₹${p.amount}
Remaining: ₹${remaining}

PAYMENT VERIFICATION:
This payment has been verified and approved by the college accountancy.

Date of Approval: ${formatDate(p.date)}
Verified By: College Accountancy Department

================================================================================
This is an official receipt from the college. Please keep this for your records.
================================================================================
    `;
    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `college-fee-receipt-${p.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({
      title: "Receipt downloaded",
      description: "College fee receipt has been downloaded successfully.",
    });
  };

  // interactive selection for per-transaction timeline
  const selectedPayment = selectedPaymentId
    ? payments.find((p) => p.id === selectedPaymentId) || null
    : payments[0] || null;

  let activeStep = 0;
  if (selectedPayment) {
    if (
      selectedPayment.status === "Success" ||
      selectedPayment.status === "Approved"
    )
      activeStep = 4;
    else if (selectedPayment.status === "Pending")
      activeStep = selectedPayment.mode === "SBI Receipt" ? 3 : 2;
    else if (selectedPayment.status === "Initiated") activeStep = 1;
  }

  // show only recorded payments (those with receipts or already approved/successful)
  const visiblePayments = payments.filter(
    (p) => p.receiptUrl || p.status === "Success" || p.status === "Approved"
  );

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Fee Payments
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Pay fees, upload receipts and track verification status
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="sm:size-default text-xs sm:text-sm self-start sm:self-auto"
              onClick={downloadFeeStructure}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />{" "}
              Download
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                <div className="text-lg sm:text-xl font-bold">₹{TOTAL_FEE}</div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Paid
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalPaid}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Pending Verification
                </div>
                <div className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  ₹{totalPending}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl shadow-sm">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Remaining
                </div>
                <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{remaining}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  After verification: ₹{remainingAfterVerification}
                </div>
              </div>
            </div>

            {/* Timeline - moved below totals and made attractive with animations */}
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
                {/* Animated connector line */}
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
                  ].map((s, i) => {
                    const step = i + 1;
                    const completed = step <= activeStep;
                    const current = step === activeStep;
                    return (
                      <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: current ? 1.05 : 1,
                        }}
                        whileHover={{
                          scale: 1.08,
                          y: -6,
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: i * 0.1,
                        }}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group h-36 sm:h-40 flex flex-col ${
                          completed
                            ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 shadow-md hover:shadow-green-400/50 dark:hover:shadow-green-600/30"
                            : current
                            ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 shadow-lg ring-2 ring-blue-300 dark:ring-blue-500 hover:shadow-blue-400/50 dark:hover:shadow-blue-600/30"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        {/* Animated background glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                            <div
                              className={`text-2xl sm:text-3xl mb-2 inline-block transition-opacity duration-300 ${
                                completed
                                  ? "opacity-100"
                                  : current
                                  ? "opacity-100"
                                  : "opacity-60 group-hover:opacity-100"
                              }`}
                            >
                              {s.icon}
                            </div>
                            <div
                              className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                                completed
                                  ? "text-green-700 dark:text-green-200"
                                  : current
                                  ? "text-blue-700 dark:text-blue-200"
                                  : "text-foreground group-hover:text-slate-900 dark:group-hover:text-slate-100"
                              }`}
                            >
                              {s.title}
                            </div>
                            <div className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                              {s.desc}
                            </div>
                          </div>

                          {completed && (
                            <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completed
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>

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
              onClick={handleSbiPay}
            >
              <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Open SBI
              Payment Portal
            </Button>
          </motion.div>

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
                  onChange={handleUploadReceipt}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full text-sm h-10"
                  onClick={handleUploadReceiptClick}
                >
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                </Button>
                {selectedFileName && (
                  <div className="mt-2 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ {selectedFileName} selected
                  </div>
                )}
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-white text-sm sm:text-base h-10 sm:h-11"
                onClick={submitPayment}
              >
                Submit Payment
              </Button>
            </div>
          </motion.div>

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

            <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full table-auto min-w-[600px]">
                <thead>
                  <tr className="text-left text-xs sm:text-sm text-muted-foreground">
                    <th className="pb-2 px-2 sm:px-0">Date</th>
                    <th className="pb-2 px-2 sm:px-0">Amount</th>
                    <th className="pb-2 px-2 sm:px-0">Mode</th>
                    <th className="pb-2 px-2 sm:px-0">Status</th>
                    <th className="pb-2 px-2 sm:px-0">Upload Receipt</th>
                    <th className="pb-2 px-2 sm:px-0">College Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.length === 0 ? (
                    <tr>
                      <td
                        className="py-6 text-center text-xs sm:text-sm text-muted-foreground px-2"
                        colSpan={6}
                      >
                        No payments yet. Use 'Pay via SBI' then upload the
                        receipt to record a payment.
                      </td>
                    </tr>
                  ) : (
                    visiblePayments.map((t) => (
                      <tr
                        key={t.id}
                        className={`border-t cursor-pointer ${
                          selectedPaymentId === t.id
                            ? "bg-accent/10"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() =>
                          setSelectedPaymentId((prev) =>
                            prev === t.id ? null : t.id
                          )
                        }
                      >
                        <td className="py-2 sm:py-3 w-32 sm:w-48 text-xs sm:text-sm px-2 sm:px-0">
                          {formatDate(t.date)}
                        </td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm px-2 sm:px-0">
                          ₹{t.amount}
                        </td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm px-2 sm:px-0">
                          {t.mode}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-0">
                          <span
                            className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                              t.status === "Approved" || t.status === "Success"
                                ? "bg-green-500 text-white"
                                : t.status === "Pending" ||
                                  t.status === "Initiated"
                                ? "bg-yellow-400 text-white"
                                : "bg-red-400 text-white"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-0">
                          {t.receiptUrl ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 sm:h-8 px-2"
                              onClick={() => downloadReceipt(t)}
                            >
                              Download
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-0">
                          {t.status === "Approved" || t.status === "Success" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 sm:h-8 px-2"
                              onClick={() => downloadCollegeReceipt(t)}
                            >
                              Download
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FeePayments;
