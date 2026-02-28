import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  GraduationCap,
  User,
  FileText,
  CreditCard,
  Bell,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Loader2,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StudentSidebar from "./Sidebar";
import { studentAPI } from "@/lib/api";
import { toast } from "sonner";

interface DocumentStatus {
  name: string;
  status: string;
  remark?: string;
  url?: string;
  key?: string;
}

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [documentProgress, setDocumentProgress] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [reuploadDocKey, setReuploadDocKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, progressData] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getDocumentProgress(),
      ]);

      setProfile(profileData);
      setDocumentProgress(progressData);

      // Convert documents object to array for display
      const docList: DocumentStatus[] = [];
      const docMapping = [
        { key: "photo", name: "Passport Photo" },
        { key: "admissionLetter", name: "Admission Letter" },
        { key: "class10Marksheet", name: "Class 10 Marksheet" },
        { key: "class12Marksheet", name: "Class 12 Marksheet" },
        { key: "jeeRankCard", name: "JEE Rank Card" },
        { key: "casteCertificate", name: "Caste Certificate" },
        { key: "incomeCertificate", name: "Income Certificate" },
        { key: "medicalCertificate", name: "Medical Certificate" },
        { key: "antiRaggingForm", name: "Anti-Ragging Form" },
        { key: "performanceForm", name: "Performance Form" },
        { key: "aadharCard", name: "Aadhar Card" },
      ];

      // Add feeReceipts array from documents
      if (
        profileData.documents?.feeReceipts &&
        Array.isArray(profileData.documents.feeReceipts)
      ) {
        profileData.documents.feeReceipts.forEach(
          (receipt: any, index: number) => {
            if (receipt && receipt.url) {
              docMapping.push({
                key: `feeReceipt-${index}`,
                name: `Fee Receipt ${index + 1}`,
              });
            }
          },
        );
      }

      docMapping.forEach((doc) => {
        // Handle feeReceipts array items
        if (doc.key.startsWith("feeReceipt-")) {
          const index = parseInt(doc.key.split("-")[1]);
          const receipt = profileData.documents?.feeReceipts?.[index];
          if (receipt && receipt.url) {
            docList.push({
              key: doc.key,
              name: doc.name,
              status: receipt.status || "pending",
              remark: receipt.remark || "",
              url: receipt.url || "",
            });
          }
        } else {
          const docData = profileData.documents?.[doc.key];
          if (docData) {
            docList.push({
              key: doc.key,
              name: doc.name,
              status: docData.status || "pending",
              remark: docData.remark || "",
              url: docData.url || "",
            });
          }
        }
      });

      setDocuments(docList);
      console.log("Documents loaded:", docList);
      console.log(
        "Rejected documents:",
        docList.filter((d) => d.status === "rejected"),
      );
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = (docKey: string) => {
    console.log("=== REUPLOAD CLICKED ===");
    console.log("Document Key:", docKey);
    console.log("File Input Ref:", fileInputRef.current);

    setReuploadDocKey(docKey);

    // Trigger file picker
    setTimeout(() => {
      if (fileInputRef.current) {
        console.log("Triggering file input click...");
        fileInputRef.current.click();
      } else {
        console.error("File input ref is null!");
      }
    }, 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("=== FILE CHANGE EVENT ===");
    const file = e.target.files?.[0];
    console.log("File selected:", file?.name, file?.type, file?.size);
    console.log("Current reuploadDocKey:", reuploadDocKey);

    if (!file) {
      console.log("No file selected - user cancelled or no file");
      return;
    }

    if (!reuploadDocKey) {
      console.error("ERROR: No reuploadDocKey set when file selected!");
      toast.error("Please try again - document key not set");
      return;
    }

    // Validate file
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      console.log("Calling reupload API for:", reuploadDocKey, file.name);

      // Check if it's a fee receipt (feeReceipt-0, feeReceipt-1, etc.)
      if (reuploadDocKey.startsWith("feeReceipt-")) {
        const index = parseInt(reuploadDocKey.split("-")[1]);
        console.log("Reuploading fee receipt at index:", index);
        await studentAPI.reuploadFeeReceipt(index, file);
      } else {
        // Regular document
        console.log("Reuploading regular document:", reuploadDocKey);
        await studentAPI.reuploadDocument(reuploadDocKey, file);
      }

      toast.success(
        "Document re-uploaded successfully! Awaiting verification.",
      );

      // Refresh data
      await fetchData();
      setReuploadDocKey(null);
    } catch (error: any) {
      console.error("Upload failed:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAdmissionStatusBadge = (status: string) => {
    switch (status) {
      case "pending_verification":
        return getStatusBadge("pending");
      case "document_verified":
        return getStatusBadge("verified");
      case "payment_pending":
        return getStatusBadge("pending");
      case "admitted":
        return getStatusBadge("verified");
      default:
        return getStatusBadge("pending");
    }
  };

  const getAdmissionStatusText = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "Your application is under review";
      case "document_verified":
        return "Documents verified successfully";
      case "payment_pending":
        return "Awaiting fee payment verification";
      case "admitted":
        return "Congratulations! Admission complete";
      default:
        return "Application submitted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load profile data</p>
            <Button onClick={fetchData} className="mt-4">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Welcome, {profile.personal?.fullName || "Student"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                JEE Application: {profile.jeeApplicationNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg">
                {getInitials(profile.personal?.fullName || "Student")}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center shadow-inner">
                  {profile.admissionStatus === "admitted" ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                  )}
                </div>
                {getAdmissionStatusBadge(profile.admissionStatus)}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Application Status
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {getAdmissionStatusText(profile.admissionStatus)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center shadow-inner">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {documentProgress?.verified || 0}/
                  {documentProgress?.total || 0} Verified
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Document Verification
              </h3>
              <Progress
                value={documentProgress?.progress || 0}
                className="mt-3 h-2 bg-muted"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center shadow-inner">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                </div>
                <Badge
                  className={`${
                    profile.fee?.remaining > 0
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-success/10 text-success border-success/20"
                  }`}
                >
                  {profile.fee?.remaining > 0 ? "Payment Due" : "Paid"}
                </Badge>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Fee Payment
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {profile.fee?.remaining > 0
                  ? `₹${profile.fee.remaining.toLocaleString()} pending`
                  : "Payment complete"}
              </p>
            </motion.div>
          </div>

          {/* Rejected Documents Alert */}
          {documents.filter((d) => d.status === "rejected").length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-lg"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-destructive/30 to-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-destructive">
                      {documents.filter((d) => d.status === "rejected").length}{" "}
                      Document
                      {documents.filter((d) => d.status === "rejected").length >
                      1
                        ? "s"
                        : ""}{" "}
                      Rejected
                    </h3>
                    <Badge className="bg-destructive text-destructive-foreground">
                      Action Required
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    The following documents have been rejected and need to be
                    re-uploaded:
                  </p>
                  <div className="space-y-2">
                    {documents
                      .filter((d) => d.status === "rejected")
                      .map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-destructive font-medium">
                            •
                          </span>
                          <div className="flex-1">
                            <span className="font-medium text-foreground">
                              {doc.name}
                            </span>
                            {doc.remark && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Reason: {doc.remark}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Please scroll down to the "Document Status" section and
                    click "Re-upload" on each rejected document.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Document Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-lg"
          >
            <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Document Status
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track verification progress of your uploaded documents
              </p>
            </div>
            <div className="divide-y divide-border">
              {documents.map((doc, index) => {
                const showReuploadButton = doc.status === "rejected" && doc.key;
                if (showReuploadButton) {
                  console.log(
                    "Rendering reupload button for:",
                    doc.name,
                    "Key:",
                    doc.key,
                  );
                }

                return (
                  <div
                    key={index}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          doc.status === "verified"
                            ? "bg-gradient-to-br from-success/20 to-success/5"
                            : doc.status === "pending"
                              ? "bg-gradient-to-br from-warning/20 to-warning/5"
                              : "bg-gradient-to-br from-destructive/20 to-destructive/5"
                        }`}
                      >
                        {doc.status === "verified" ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        ) : doc.status === "pending" ? (
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                        ) : (
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                          {doc.name}
                        </p>
                        {doc.remark && (
                          <p className="text-xs sm:text-sm text-destructive mt-1">
                            {doc.remark}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 ml-12 sm:ml-0">
                      {getStatusBadge(doc.status)}
                      {(() => {
                        const shouldShow =
                          doc.status === "rejected" &&
                          doc.key &&
                          !doc.key.startsWith("payment-");
                        console.log(
                          "Button check:",
                          doc.name,
                          "Status:",
                          doc.status,
                          "Key:",
                          doc.key,
                          "ShouldShow:",
                          shouldShow,
                        );
                        return shouldShow ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-8"
                            onClick={() => {
                              console.log(
                                "Button clicked! Doc:",
                                doc.name,
                                "Key:",
                                doc.key,
                              );
                              handleReupload(doc.key!);
                            }}
                            disabled={uploading}
                          >
                            {uploading && reuploadDocKey === doc.key ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3 mr-1" />
                                Re-upload
                              </>
                            )}
                          </Button>
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-card border border-primary/20 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">
                Fee Payment
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Complete your fee payment through SBI Collect portal. Keep the
                transaction receipt for your records.
              </p>
              <Button className="w-full shadow-md hover:shadow-lg transition-all">
                <ExternalLink className="w-4 h-4 mr-2" />
                Pay via SBI Collect
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 flex items-center justify-center mb-3 sm:mb-4">
                <Download className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">
                Download Documents
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                Download your application acknowledgment and other documents.
              </p>
              <Button
                variant="outline"
                className="w-full shadow-sm hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Acknowledgment
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Hidden file input for reupload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
    </div>
  );
};

export default StudentDashboard;
