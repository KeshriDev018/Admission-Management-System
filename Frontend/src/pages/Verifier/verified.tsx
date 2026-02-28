import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Eye,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
import VerifierSidebar from "./Sidebar";
import { verifierAPI } from "@/lib/api";
import { toast } from "sonner";

const Verified = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<
    any | null
  >(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVerifiedStudents();
  }, []);

  const fetchVerifiedStudents = async () => {
    try {
      setLoading(true);
      const data = await verifierAPI.getMyVerifiedStudents();
      setStudents(data);
    } catch (error: any) {
      console.error("Failed to fetch verified students:", error);
      toast.error(
        error.response?.data?.message || "Failed to load verified students",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocuments = async (student: any) => {
    try {
      setSelectedStudent(student);
      setIsDocumentDialogOpen(true);

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
      if (doc && doc.url) {
        docList.push({
          key: field.key,
          name: field.name,
          url: doc.url,
          status: doc.status,
          remark: doc.remark,
        });
      }
    });

    // Fee receipts
    docs.feeReceipts?.forEach((receipt: any, index: number) => {
      if (receipt && receipt.url) {
        docList.push({
          key: `feeReceipt-${index}`,
          name: `Fee Receipt ${index + 1}`,
          url: receipt.url,
          status: receipt.status,
          remark: receipt.remark,
        });
      }
    });

    return docList;
  };

  const getDocStatusBadge = (status: string) => {
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
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.personal?.fullName?.toLowerCase().includes(query) ||
        student.user?.email?.toLowerCase().includes(query) ||
        student.jeeApplicationNumber?.toLowerCase().includes(query) ||
        student.personal?.branchAllocated?.toLowerCase().includes(query)
      );
    });
  }, [students, searchQuery]);

  // Paginate students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIdx, endIdx);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "document_verified":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Doc Verified
          </Badge>
        );
      case "payment_pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Payment Pending
          </Badge>
        );
      case "admitted":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Admitted
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <VerifierSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading verified students...
            </p>
          </div>
        </main>
      </div>
    );
  }

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
                Verified Students
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                View all students you have verified and their details
              </p>
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
                    Total Verified
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {students.length}
                  </div>
                </div>
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
                    Page
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {totalPages > 0 ? currentPage : 0} / {totalPages}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Students Table */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
            >
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[800px]">
                  <thead>
                    <tr className="text-left text-[10px] sm:text-sm text-muted-foreground border-b border-border">
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Name
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        JEE Number
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Email
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Category
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Branch
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Status
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Date
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td
                          className="py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground"
                          colSpan={8}
                        >
                          No verified students found matching your search.
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
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-success" />
                              <span className="font-medium text-xs sm:text-sm">
                                {student.personal?.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {student.jeeApplicationNumber}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              {student.user?.email}
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <Badge variant="outline" className="text-xs">
                              {student.personal?.category}
                            </Badge>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {student.personal?.branchAllocated}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            {getStatusBadge(student.admissionStatus)}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {formatDate(student.createdAt)}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
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
              Verified Documents - {selectedStudent?.personal?.fullName}
            </DialogTitle>
            <DialogDescription>
              JEE Application No: {selectedStudent?.jeeApplicationNumber} |
              Email: {selectedStudent?.user?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Documents */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Uploaded Documents
              </p>
              {!selectedStudentDetails ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            {doc.status && (
                              <div className="mt-1">
                                {getDocStatusBadge(doc.status)}
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
                        <div className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg mt-2">
                          <MessageSquare className="w-4 h-4 text-destructive mt-0.5" />
                          <p className="text-sm text-destructive">
                            {doc.remark}
                          </p>
                        </div>
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

export default Verified;
