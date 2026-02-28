import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import AdminSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending_verification: {
      label: "Pending",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    verified: {
      label: "Verified",
      className: "bg-success/10 text-success border-success/20",
    },
    document_verified: {
      label: "Doc Verified",
      className: "bg-info/10 text-info border-info/20",
    },
    payment_pending: {
      label: "Payment Pending",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    admitted: {
      label: "Admitted",
      className: "bg-success/10 text-success border-success/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const statusInfo = statusMap[status] || {
    label: status,
    className: "bg-muted/10 text-muted-foreground border-muted/20",
  };

  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchStudents();
  }, [currentPage, statusFilter]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit,
      };

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await adminAPI.getStudentsByStatus(params);
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (error: any) {
      console.error("Failed to fetch students:", error);
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (studentId: string) => {
    try {
      setIsLoadingDetails(true);
      setIsDetailsOpen(true);
      const student = await adminAPI.getStudentDetails(studentId);
      setSelectedStudent(student);
    } catch (error: any) {
      console.error("Failed to fetch student details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load student details",
      );
      setIsDetailsOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Students
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage student records and statuses
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or JEE number..."
                  className="pl-9 w-full sm:w-64 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 sm:w-40 h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_verification">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="document_verified">
                    Doc Verified
                  </SelectItem>
                  <SelectItem value="payment_pending">
                    Payment Pending
                  </SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleSearch}
                className="h-9 text-xs sm:text-sm"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Search
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Student Records
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {totalRecords} total student{totalRecords !== 1 ? "s" : ""}{" "}
                    registered
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        JEE Application No
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.length > 0 ? (
                      students.map((s: any) => (
                        <tr
                          key={s._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                            {s.jeeApplicationNumber || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                            {s.personal?.fullName || s.user?.name || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                            {s.account?.email || s.user?.email || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                            {s.personal?.branchAllocated || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                            {s.personal?.category || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {getStatusBadge(s.admissionStatus)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => handleViewDetails(s._id)}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 sm:px-6 py-8 text-center text-sm text-muted-foreground"
                        >
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Showing page {currentPage} of {totalPages} ({totalRecords}{" "}
                  total records)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {currentPage}
                  </span>
                  <Button
                    size="sm"
                    className="text-xs h-8"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Student Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Complete information about the student
              </DialogDescription>
            </DialogHeader>
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : selectedStudent ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {selectedStudent.personal?.fullName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        JEE Application Number
                      </p>
                      <p className="font-medium">
                        {selectedStudent.jeeApplicationNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Father's Name
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.fatherName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Mother's Name
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.motherName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">
                        {selectedStudent.personal?.gender || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.dob
                          ? new Date(
                              selectedStudent.personal.dob,
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">
                        {selectedStudent.personal?.category || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nationality
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.nationality || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {selectedStudent.account?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-medium">
                        {selectedStudent.account?.phone || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {selectedStudent.personal?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Branch Allocated
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.branchAllocated || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">JEE Rank</p>
                      <p className="font-medium">
                        {selectedStudent.academic?.jeeRank || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        State of Eligibility
                      </p>
                      <p className="font-medium">
                        {selectedStudent.personal?.state || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Round</p>
                      <p className="font-medium">
                        {selectedStudent.personal?.round || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assignment Information */}
                {(selectedStudent.assignedVerifier ||
                  selectedStudent.assignedAccountant) && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Assignment Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedStudent.assignedVerifier && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Assigned Verifier
                          </p>
                          <p className="font-medium">
                            {selectedStudent.assignedVerifier.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedStudent.assignedVerifier.email}
                          </p>
                        </div>
                      )}
                      {selectedStudent.assignedAccountant && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Assigned Accountant
                          </p>
                          <p className="font-medium">
                            {selectedStudent.assignedAccountant.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedStudent.assignedAccountant.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Status</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Admission Status:
                    </p>
                    {getStatusBadge(selectedStudent.admissionStatus)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No student data available
              </p>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Students;
