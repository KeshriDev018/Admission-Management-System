import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
import VerifierSidebar from "./Sidebar";
import { verifierAPI } from "@/lib/api";

const VerifierDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<
    any | null
  >(null);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processingDoc, setProcessingDoc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      setLoading(true);
      const data = await verifierAPI.getMyPendingStudents();
      setStudents(data);
    } catch (error: any) {
      console.error("Failed to fetch students:", error);
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId: string) => {
    try {
      const data = await verifierAPI.getAssignedStudentDetails(studentId);
      setSelectedStudentDetails(data);
    } catch (error: any) {
      console.error("Failed to fetch student details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load student details",
      );
    }
  };

  const handleViewDocuments = async (student: any) => {
    setSelectedStudent(student);
    setRemarks({});
    await fetchStudentDetails(student._id);
    setIsDialogOpen(true);
  };

  const handleVerify = async (
    docType: string,
    docName: string,
    isReceipt: boolean = false,
    index?: number,
  ) => {
    if (!selectedStudentDetails) return;

    try {
      setProcessingDoc(docType);
      if (isReceipt && index !== undefined) {
        await verifierAPI.verifyReceipt(selectedStudentDetails._id, index);
      } else {
        await verifierAPI.verifyDocument(selectedStudentDetails._id, docType);
      }
      toast.success(`${docName} verified successfully`);

      // Refresh student details
      await fetchStudentDetails(selectedStudentDetails._id);
      await fetchPendingStudents();
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error.response?.data?.message || "Failed to verify document");
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleReject = async (
    docType: string,
    docName: string,
    isReceipt: boolean = false,
    index?: number,
  ) => {
    if (!selectedStudentDetails) return;

    const currentRemark = remarks[docType] || "";
    if (!currentRemark.trim()) {
      toast.error("Please add a remark for rejection");
      return;
    }

    try {
      setProcessingDoc(docType);
      if (isReceipt && index !== undefined) {
        await verifierAPI.rejectReceipt(
          selectedStudentDetails._id,
          index,
          currentRemark,
        );
      } else {
        await verifierAPI.rejectDocument(
          selectedStudentDetails._id,
          docType,
          currentRemark,
        );
      }
      toast.success(`${docName} rejected with remark`);
      setRemarks((prev) => {
        const updated = { ...prev };
        delete updated[docType];
        return updated;
      });

      // Refresh student details
      await fetchStudentDetails(selectedStudentDetails._id);
      await fetchPendingStudents();
    } catch (error: any) {
      console.error("Rejection failed:", error);
      toast.error(error.response?.data?.message || "Failed to reject document");
    } finally {
      setProcessingDoc(null);
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

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.personal?.fullName?.toLowerCase().includes(query) ||
      student.jeeApplicationNumber?.toLowerCase().includes(query) ||
      student.personal?.category?.toLowerCase().includes(query)
    );
  });

  // Build document list from student details
  const buildDocumentList = () => {
    if (!selectedStudentDetails?.documents) return [];

    const docList: any[] = [];
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

    docMapping.forEach((doc) => {
      const docData = selectedStudentDetails.documents[doc.key];
      if (docData && docData.url) {
        docList.push({
          key: doc.key,
          name: doc.name,
          status: docData.status || "pending",
          remark: docData.remark || "",
          url: docData.url || "",
          isReceipt: false,
        });
      }
    });

    // Add fee receipts
    if (
      selectedStudentDetails.documents.feeReceipts &&
      Array.isArray(selectedStudentDetails.documents.feeReceipts)
    ) {
      selectedStudentDetails.documents.feeReceipts.forEach(
        (receipt: any, index: number) => {
          if (receipt && receipt.url) {
            docList.push({
              key: `feeReceipt-${index}`,
              name: `Fee Receipt ${index + 1}`,
              status: receipt.status || "pending",
              remark: receipt.remark || "",
              url: receipt.url || "",
              isReceipt: true,
              index: index,
            });
          }
        },
      );
    }

    return docList;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <VerifierSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <VerifierSidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Document Verification
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Review and verify student documents
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success flex items-center justify-center text-success-foreground font-semibold text-xs sm:text-sm">
                VR
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                icon: Clock,
                label: "Pending",
                value: students.length.toString(),
                color: "bg-warning/10 text-warning",
              },
              {
                icon: CheckCircle,
                label: "Verified Today",
                value: "0",
                color: "bg-success/10 text-success",
              },
              {
                icon: XCircle,
                label: "Rejected Today",
                value: "0",
                color: "bg-destructive/10 text-destructive",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Application ID or Name..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Applications List */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending students found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-foreground">
                          {student.personal?.fullName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {student.jeeApplicationNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {student.personal?.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {student.personal?.branchAllocated}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocuments(student)}
                        className="h-8 sm:h-9 w-full sm:w-auto"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span className="text-xs sm:text-sm">
                          Review Documents
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Document Summary */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Submitted:{" "}
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Document Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Verification</DialogTitle>
            <DialogDescription>
              Review documents for {selectedStudentDetails?.personal?.fullName}{" "}
              ({selectedStudentDetails?.jeeApplicationNumber})
            </DialogDescription>
          </DialogHeader>

          {!selectedStudentDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {buildDocumentList().map((doc, index) => (
                <div
                  key={index}
                  className="border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {doc.name}
                        </p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View document
                        </a>
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  {doc.status === "pending" && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add remark (required for rejection)..."
                        value={remarks[doc.key] || ""}
                        onChange={(e) =>
                          setRemarks((prev) => ({
                            ...prev,
                            [doc.key]: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 bg-success hover:bg-success/90"
                          onClick={() =>
                            handleVerify(
                              doc.key,
                              doc.name,
                              doc.isReceipt,
                              doc.index,
                            )
                          }
                          disabled={processingDoc === doc.key}
                        >
                          {processingDoc === doc.key ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Verify
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleReject(
                              doc.key,
                              doc.name,
                              doc.isReceipt,
                              doc.index,
                            )
                          }
                          disabled={processingDoc === doc.key}
                        >
                          {processingDoc === doc.key ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {doc.status === "rejected" && doc.remark && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-destructive mt-0.5" />
                      <p className="text-sm text-destructive">{doc.remark}</p>
                    </div>
                  )}

                  {doc.status === "verified" && (
                    <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <p className="text-sm text-success">Document verified</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifierDashboard;
