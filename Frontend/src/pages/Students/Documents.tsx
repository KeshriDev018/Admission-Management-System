import { motion } from "framer-motion";
import {
  Download,
  Upload,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import StudentSidebar from "./Sidebar";
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
import { studentAPI } from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Document {
  key: string;
  name: string;
  status: string;
  remark?: string;
  url?: string;
}

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [reuploadDocKey, setReuploadDocKey] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileData = await studentAPI.getProfile();
      setProfile(profileData);

      // Convert documents object to array
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

      const docList: Document[] = [];
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
          if (docData && docData.url) {
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
    } catch (error: any) {
      console.error("Failed to fetch documents:", error);
      toast.error(error.response?.data?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = (docKey: string) => {
    console.log("Reupload clicked for:", docKey);
    setReuploadDocKey(docKey);
    // Small delay to ensure state is set before triggering file picker
    setTimeout(() => {
      if (fileInputRef.current) {
        console.log("Opening file picker for:", docKey);
        fileInputRef.current.click();
      }
    }, 50);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(
      "File selected:",
      file?.name,
      "Current docKey:",
      reuploadDocKey,
    );

    if (!file) {
      console.log("No file selected");
      return;
    }

    if (!reuploadDocKey) {
      console.log("No reuploadDocKey set, this shouldn't happen");
      toast.error("Please try again");
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

  const handleViewDocument = (doc: Document) => {
    setPreviewUrl(doc.url || null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Documents
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                View and manage your uploaded documents
              </p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
              Your Documents
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              List of uploaded documents and their verification status
            </p>

            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No documents uploaded yet
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-xl hover:shadow-md transition-all duration-300 bg-card/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {doc.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(doc.status)}
                        </div>
                        {doc.status === "rejected" && doc.remark && (
                          <div className="text-xs text-destructive mt-2 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{doc.remark}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-12 sm:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        View
                      </Button>
                      {doc.status === "rejected" &&
                        !doc.key.startsWith("payment-") &&
                        !doc.key.startsWith("feeReceipt-") && (
                          <Button
                            size="sm"
                            className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                            onClick={() => handleReupload(doc.key)}
                            disabled={uploading}
                          >
                            {uploading && reuploadDocKey === doc.key ? (
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            )}
                            Reupload
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
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

      {/* Document Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[70vh] overflow-auto">
            {previewUrl && (
              <>
                {previewUrl.endsWith(".pdf") ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-[600px] border rounded-lg"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Document Preview"
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
