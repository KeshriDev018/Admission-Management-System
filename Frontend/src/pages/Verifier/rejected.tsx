import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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

const Rejected = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<
    any | null
  >(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [processingDoc, setProcessingDoc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Rejected" | "Reupload">(
    "Rejected",
  );
  const [documentRemarks, setDocumentRemarks] = useState<
    Record<string, string>
  >({});
  const [rejectedCount, setRejectedCount] = useState(0);
  const [reuploadCount, setReuploadCount] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchRejectedStudents();
  }, [activeTab]);

  useEffect(() => {
    fetchCounts();
  }, []);
  const fetchCounts = async () => {
    try {
      const rejectedData = await verifierAPI.getRejectedNotReuploadedStudents();
      const reuploadedData = await verifierAPI.getRejectedReuploadedStudents();
      setRejectedCount(rejectedData.length);
      setReuploadCount(reuploadedData.length);
    } catch (error: any) {
      console.error("Failed to fetch counts:", error);
    }
  };
  const fetchRejectedStudents = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "Rejected") {
        data = await verifierAPI.getRejectedNotReuploadedStudents();
      } else {
        data = await verifierAPI.getRejectedReuploadedStudents();
      }
      setStudents(data);

      // Refresh counts
      await fetchCounts();
    } catch (error: any) {
      console.error("Failed to fetch rejected students:", error);
      toast.error(
        error.response?.data?.message || "Failed to load rejected students",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocuments = async (student: any) => {
    try {
      setSelectedStudent(student);
      setIsDocumentDialogOpen(true);
      setDocumentRemarks({});

      // Fetch full student details
      const details = await verifierAPI.getAssignedStudentDetails(student._id);
      setSelectedStudentDetails(details);
    } catch (error: any) {
      console.error("Failed to fetch student details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load student details",
      );
    }
  };

  const buildDocumentList = () => {
    if (!selectedStudentDetails) return [];

    const docs = selectedStudentDetails.documents;
    const docList: any[] = [];

    // Regular documents
    const docFields = [
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

    docFields.forEach((field) => {
      const doc = docs[field.key];
      if (doc && doc.url && doc.status === "rejected") {
        // Filter by reuploaded status based on active tab
        const shouldShow =
          activeTab === "Reupload"
            ? doc.reuploaded === true
            : doc.reuploaded === false || doc.reuploaded === undefined;

        if (shouldShow) {
          docList.push({
            key: field.key,
            name: field.name,
            url: doc.url,
            status: doc.status,
            remark: doc.remark,
            reuploaded: doc.reuploaded,
            isReceipt: false,
          });
        }
      }
    });

    // Fee receipts
    docs.feeReceipts?.forEach((receipt: any, index: number) => {
      if (receipt && receipt.url && receipt.status === "rejected") {
        // Filter by reuploaded status based on active tab
        const shouldShow =
          activeTab === "Reupload"
            ? receipt.reuploaded === true
            : receipt.reuploaded === false || receipt.reuploaded === undefined;

        if (shouldShow) {
          docList.push({
            key: `feeReceipt-${index}`,
            name: `Fee Receipt ${index + 1}`,
            url: receipt.url,
            status: receipt.status,
            remark: receipt.remark,
            reuploaded: receipt.reuploaded,
            isReceipt: true,
            index,
          });
        }
      }
    });

    return docList;
  };

  const handleVerify = async (
    docKey: string,
    docName: string,
    isReceipt: boolean,
    index?: number,
  ) => {
    try {
      setProcessingDoc(docKey);

      if (isReceipt && index !== undefined) {
        await verifierAPI.verifyReceipt(selectedStudentDetails._id, index);
      } else {
        await verifierAPI.verifyDocument(selectedStudentDetails._id, docKey);
      }

      toast.success(`${docName} verified successfully`);

      // Refresh student details
      const details = await verifierAPI.getAssignedStudentDetails(
        selectedStudentDetails._id,
      );
      setSelectedStudentDetails(details);

      // Refresh the rejected students list
      await fetchRejectedStudents();
    } catch (error: any) {
      console.error("Failed to verify:", error);
      toast.error(error.response?.data?.message || "Failed to verify document");
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleReject = async (
    docKey: string,
    docName: string,
    isReceipt: boolean,
    index?: number,
  ) => {
    const currentRemark = documentRemarks[docKey] || "";
    if (!currentRemark.trim()) {
      toast.error("Please add a remark before rejecting");
      return;
    }

    try {
      setProcessingDoc(docKey);

      if (isReceipt && index !== undefined) {
        await verifierAPI.rejectReceipt(
          selectedStudentDetails._id,
          index,
          currentRemark,
        );
      } else {
        await verifierAPI.rejectDocument(
          selectedStudentDetails._id,
          docKey,
          currentRemark,
        );
      }

      toast.success(`${docName} rejected with remarks`);
      setDocumentRemarks((prev) => {
        const updated = { ...prev };
        delete updated[docKey];
        return updated;
      });

      // Refresh student details
      const details = await verifierAPI.getAssignedStudentDetails(
        selectedStudentDetails._id,
      );
      setSelectedStudentDetails(details);

      // Refresh the rejected students list
      await fetchRejectedStudents();
    } catch (error: any) {
      console.error("Failed to reject:", error);
      toast.error(error.response?.data?.message || "Failed to reject document");
    } finally {
      setProcessingDoc(null);
    }
  };

  const getRejectedDocuments = (student: any) => {
    if (!student || !student.documents) {
      return [];
    }

    const rejectedDocs: string[] = [];
    const docs = student.documents;

    // Check regular documents
    const docFields = [
      { key: "photo", name: "Photo" },
      { key: "admissionLetter", name: "Admission Letter" },
      { key: "class10Marksheet", name: "Class 10" },
      { key: "class12Marksheet", name: "Class 12" },
      { key: "jeeRankCard", name: "JEE Card" },
      { key: "casteCertificate", name: "Caste Cert" },
      { key: "incomeCertificate", name: "Income Cert" },
      { key: "medicalCertificate", name: "Medical Cert" },
      { key: "antiRaggingForm", name: "Anti-Ragging" },
      { key: "performanceForm", name: "Performance" },
      { key: "aadharCard", name: "Aadhar" },
    ];

    docFields.forEach((field) => {
      if (docs[field.key]?.status === "rejected") {
        rejectedDocs.push(field.name);
      }
    });

    // Check fee receipts
    docs.feeReceipts?.forEach((receipt: any, index: number) => {
      if (receipt?.status === "rejected") {
        rejectedDocs.push(`Fee Receipt ${index + 1}`);
      }
    });

    return rejectedDocs.join(", ") || "Various documents";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filter by tab (Rejected vs Reupload)
  // Backend already filters by tab, so just return students as-is
  const filteredByTab = useMemo(() => {
    return students;
  }, [students]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return filteredByTab.filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.personal?.fullName?.toLowerCase().includes(query) ||
        student.user?.email?.toLowerCase().includes(query) ||
        student.jeeApplicationNumber?.toLowerCase().includes(query) ||
        student.personal?.branchAllocated?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, filteredByTab]);

  // Paginate students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIdx, endIdx);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const getRejectedDocNames = (student: any) => {
    if (!student?.documents) return "N/A";
    const docFields = [
      { key: "photo", name: "Photo" },
      { key: "admissionLetter", name: "Admission Letter" },
      { key: "class10Marksheet", name: "Class 10" },
      { key: "class12Marksheet", name: "Class 12" },
      { key: "jeeRankCard", name: "JEE Card" },
      { key: "casteCertificate", name: "Caste Cert" },
      { key: "incomeCertificate", name: "Income Cert" },
      { key: "medicalCertificate", name: "Medical Cert" },
      { key: "antiRaggingForm", name: "Anti-Ragging" },
      { key: "performanceForm", name: "Performance" },
      { key: "aadharCard", name: "Aadhar" },
    ];

    const rejected = docFields
      .filter((field) => {
        const doc = student.documents[field.key];
        if (!doc || doc.status !== "rejected") return false;

        // Filter based on active tab
        const shouldShow =
          activeTab === "Reupload"
            ? doc.reuploaded === true
            : doc.reuploaded === false || doc.reuploaded === undefined;

        return shouldShow;
      })
      .map((field) => field.name);

    const receiptsRejected =
      student.documents.feeReceipts?.filter((r: any) => {
        if (!r || r.status !== "rejected") return false;

        // Filter based on active tab
        const shouldShow =
          activeTab === "Reupload"
            ? r.reuploaded === true
            : r.reuploaded === false || r.reuploaded === undefined;

        return shouldShow;
      }).length || 0;
    if (receiptsRejected > 0) {
      rejected.push(`Fee Receipt (${receiptsRejected})`);
    }

    return rejected.length > 0 ? rejected.join(", ") : "N/A";
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDocumentApprove = (docName: string) => {
    toast.success(`${docName} approved successfully!`);
  };

  const handleDocumentReject = (docName: string) => {
    const remark = documentRemarks[docName] || "";
    if (!remark.trim()) {
      toast.error(`Please add remarks for ${docName} before rejecting`);
      return;
    }
    toast.success(`${docName} rejected with remarks`);
  };

  return (
    <div className="min-h-screen bg-background">
      <VerifierSidebar />

      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <div className="p-4 sm:p-6 pr-20 lg:pr-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Rejected Documents
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review rejected documents and track reupload status
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => {
                  setActiveTab("Rejected");
                  setCurrentPage(1);
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Rejected ({rejectedCount})</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("Reupload");
                  setCurrentPage(1);
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === "Reupload"
                    ? "bg-yellow-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Reuploaded ({reuploadCount})</span>
                </div>
              </button>
            </div>

            {/* Search and Stats */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, roll no, or department..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 sm:pl-10 w-full h-9 sm:h-auto text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Results Found
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {filteredStudents.length}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Status
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {activeTab === "Rejected" ? (
                      <span className="text-red-600">Rejected</span>
                    ) : (
                      <span className="text-yellow-600">Reupload</span>
                    )}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Page
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {totalPages > 0 ? currentPage : 0} / {totalPages}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rejected Students Table */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
            >
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full table-auto min-w-[700px]">
                  <thead>
                    <tr className="text-left text-[10px] sm:text-sm text-muted-foreground border-b border-border">
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Name
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Roll No
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Email
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Rejected Documents
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Date
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-0 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td
                          className="py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground"
                          colSpan={6}
                        >
                          No {activeTab.toLowerCase()} documents found.
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student, idx) => (
                        <motion.tr
                          key={student._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-t border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 sm:py-4 px-2 sm:px-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {activeTab === "Rejected" ? (
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                              ) : (
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                              )}
                              <span className="font-medium text-xs sm:text-sm">
                                {student.personal?.fullName || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {student.jeeApplicationNumber || "N/A"}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {student.user?.email || "N/A"}
                          </td>
                          <td
                            className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm max-w-[150px] sm:max-w-xs truncate"
                            title={getRejectedDocNames(student)}
                          >
                            {getRejectedDocNames(student)}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {formatDate(student.createdAt)}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocuments(student)}
                              className="h-7 sm:h-8 text-xs sm:text-sm"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">
                                View Docs
                              </span>
                              <span className="sm:hidden">View</span>
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
                className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 shadow-lg"
              >
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Showing {startIdx + 1}-
                  {Math.min(endIdx, filteredStudents.length)} of{" "}
                  {filteredStudents.length} students
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-muted rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">
                      {currentPage}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      /
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Document Viewer Dialog */}
      <Dialog
        open={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Uploaded Documents -{" "}
              {selectedStudent?.personal?.fullName || "Student"}
            </DialogTitle>
            <DialogDescription>
              JEE Application No: {selectedStudent?.jeeApplicationNumber} |
              Email: {selectedStudent?.user?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Rejection Reason */}
            {getRejectedDocuments(selectedStudent) && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-200">
                      Rejected Documents
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {getRejectedDocuments(selectedStudent)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reupload Status */}
            {selectedStudentDetails && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Current Status:
                </p>
                <div className="flex items-center gap-2">
                  {activeTab === "Reupload" ? (
                    <>
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">
                        Student has reuploaded documents - Ready for
                        verification
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="font-medium text-red-700 dark:text-red-300">
                        Awaiting student reupload
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Reupload Alert */}
            {activeTab === "Reupload" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="w-4 h-4" />
                  Student has reuploaded documents - Ready for re-verification
                </p>
              </div>
            )}

            {/* Documents */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Uploaded Documents
              </p>
              {!selectedStudentDetails ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : buildDocumentList().length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "Rejected"
                      ? "No rejected documents found"
                      : "No reuploaded documents found"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {buildDocumentList().map((doc) => (
                    <motion.div
                      key={doc.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            {doc.status && (
                              <div className="mt-1">
                                {getStatusBadge(doc.status)}
                              </div>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </a>
                      </div>

                      {doc.status === "rejected" && doc.remark && (
                        <div className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg mb-3">
                          <MessageSquare className="w-4 h-4 text-destructive mt-0.5" />
                          <p className="text-sm text-destructive">
                            {doc.remark}
                          </p>
                        </div>
                      )}

                      {/* Show verify/reject buttons for both rejected and pending (reuploaded) documents */}
                      {(doc.status === "rejected" ||
                        doc.status === "pending") && (
                        <>
                          {/* Remark input for this document */}
                          <Textarea
                            placeholder="Add remarks (required for rejection)..."
                            value={documentRemarks[doc.key] || ""}
                            onChange={(e) =>
                              setDocumentRemarks((prev) => ({
                                ...prev,
                                [doc.key]: e.target.value,
                              }))
                            }
                            className="text-sm min-h-[60px] mb-3"
                          />

                          {/* Action buttons for this document */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleVerify(
                                  doc.key,
                                  doc.name,
                                  doc.isReceipt,
                                  doc.index,
                                )
                              }
                              disabled={processingDoc === doc.key}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              {processingDoc === doc.key ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              )}
                              Verify
                            </Button>
                            <Button
                              onClick={() =>
                                handleReject(
                                  doc.key,
                                  doc.name,
                                  doc.isReceipt,
                                  doc.index,
                                )
                              }
                              disabled={processingDoc === doc.key}
                              variant="destructive"
                              className="flex-1"
                              size="sm"
                            >
                              {processingDoc === doc.key ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rejected;
