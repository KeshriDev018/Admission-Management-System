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
} from "lucide-react";
import { useState, useMemo } from "react";
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

type RejectedDocument = {
  name: string;
  uploadedDate: string;
  url: string;
  status?: "pending" | "approved" | "rejected";
  remark?: string;
};

type RejectedStudent = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  program: string;
  department: string;
  rejectionDate: string;
  rejectionReason: string;
  documents: RejectedDocument[];
  reuploadStatus: "Rejected" | "Reupload";
};

const Rejected = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Rejected" | "Reupload">(
    "Rejected"
  );
  const [selectedStudent, setSelectedStudent] =
    useState<RejectedStudent | null>(null);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [documentRemarks, setDocumentRemarks] = useState<
    Record<string, string>
  >({});
  const itemsPerPage = 10;

  // Demo rejected students data with document details
  const rejectedStudents: RejectedStudent[] = [
    {
      id: "r-1",
      name: "Rahul Singh",
      email: "rahul.singh@student.com",
      rollNo: "CSE-015",
      program: "B.Tech",
      department: "Computer Science",
      rejectionDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason: "Passport photo quality is poor, image is blurry",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 10 Marksheet",
          uploadedDate: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Rejected",
    },
    {
      id: "r-2",
      name: "Kavya Patel",
      email: "kavya.patel@student.com",
      rollNo: "ENG-012",
      program: "B.Tech",
      department: "Electronics",
      rejectionDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason: "Class 12 marksheet is incomplete, missing signature",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 12 Marksheet",
          uploadedDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Reupload",
    },
    {
      id: "r-3",
      name: "Aditya Kumar",
      email: "aditya.kumar@student.com",
      rollNo: "CSE-009",
      program: "B.Tech",
      department: "Computer Science",
      rejectionDate: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason: "Aadhar card is expired, please upload valid ID",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Aadhar Card",
          uploadedDate: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Rejected",
    },
    {
      id: "r-4",
      name: "Shreya Desai",
      email: "shreya.desai@student.com",
      rollNo: "ME-008",
      program: "B.Tech",
      department: "Mechanical",
      rejectionDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason:
        "Class 10 certificate date mismatch with other documents",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 10 Marksheet",
          uploadedDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 12 Marksheet",
          uploadedDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Reupload",
    },
    {
      id: "r-5",
      name: "Harshit Jain",
      email: "harshit.jain@student.com",
      rollNo: "CSE-020",
      program: "B.Sc",
      department: "Computer Science",
      rejectionDate: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason:
        "Document font/text is not legible in Class 12 marksheet",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 12 Marksheet",
          uploadedDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Rejected",
    },
    {
      id: "r-6",
      name: "Nisha Verma",
      email: "nisha.verma@student.com",
      rollNo: "ENG-014",
      program: "B.Tech",
      department: "Electronics",
      rejectionDate: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason:
        "Photograph does not meet official document requirements",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Class 10 Marksheet",
          uploadedDate: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Reupload",
    },
    {
      id: "r-7",
      name: "Sanjay Rao",
      email: "sanjay.rao@student.com",
      rollNo: "ME-011",
      program: "B.Tech",
      department: "Mechanical",
      rejectionDate: new Date(
        Date.now() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason: "Missing caste certificate as per eligibility criteria",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Rejected",
    },
    {
      id: "r-8",
      name: "Pooja Singh",
      email: "pooja.singh@student.com",
      rollNo: "CSE-018",
      program: "B.Tech",
      department: "Computer Science",
      rejectionDate: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rejectionReason: "Age does not match with birth certificate",
      documents: [
        {
          name: "Passport Photo",
          uploadedDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
        {
          name: "Birth Certificate",
          uploadedDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          url: "#",
        },
      ],
      reuploadStatus: "Reupload",
    },
  ];

  // Filter by tab
  const filteredByTab = useMemo(() => {
    return rejectedStudents.filter((s) => s.reuploadStatus === activeTab);
  }, [activeTab]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return filteredByTab.filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, filteredByTab]);

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

  const handleViewDocuments = (student: RejectedStudent) => {
    setSelectedStudent(student);
    setDocumentRemarks({});
    setIsDocumentDialogOpen(true);
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

  const rejectedCount = rejectedStudents.filter(
    (s) => s.reuploadStatus === "Rejected"
  ).length;
  const reuploadCount = rejectedStudents.filter(
    (s) => s.reuploadStatus === "Reupload"
  ).length;

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
                  <span>Reupload Pending ({reuploadCount})</span>
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
                        Rejection Reason
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
                          key={student.id}
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
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {student.rollNo}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {student.email}
                          </td>
                          <td
                            className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm max-w-[150px] sm:max-w-xs truncate"
                            title={student.rejectionReason}
                          >
                            {student.rejectionReason}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-0 text-xs sm:text-sm">
                            {formatDate(student.rejectionDate)}
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
              Uploaded Documents - {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>
              Roll No: {selectedStudent?.rollNo} | Email:{" "}
              {selectedStudent?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Rejection Reason */}
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex gap-2">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-200">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {selectedStudent?.rejectionReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Reupload Status */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Current Status:
              </p>
              <div className="flex items-center gap-2">
                {selectedStudent?.reuploadStatus === "Reupload" ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Student has reupload documents - Ready for verification
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

            {/* Reupload Status */}
            {activeTab === "Reupload" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="w-4 h-4" />
                  Student has reupload documents - Ready for re-verification
                </p>
              </div>
            )}

            {/* Documents */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Uploaded Documents
              </p>
              <div className="space-y-3">
                {selectedStudent?.documents.map((doc) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {formatDate(doc.uploadedDate)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>

                    {/* Remark input for this document */}
                    <Textarea
                      placeholder="Add remarks (required for rejection)..."
                      value={documentRemarks[doc.name] || ""}
                      onChange={(e) =>
                        setDocumentRemarks((prev) => ({
                          ...prev,
                          [doc.name]: e.target.value,
                        }))
                      }
                      className="text-sm min-h-[60px] mb-3"
                    />

                    {/* Action buttons for this document */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDocumentApprove(doc.name)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleDocumentReject(doc.name)}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rejected;
