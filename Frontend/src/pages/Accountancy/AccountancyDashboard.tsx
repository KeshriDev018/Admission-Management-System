import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AccountancySidebar from "./Sidebar";
import StudentDetailsDialog from "./StudentDetailsDialog.tsx";
import { accountancyAPI } from "@/lib/api";

type TabType = "pending" | "rejected" | "admitted";

const AccountancyDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Stats
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [admittedCount, setAdmittedCount] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, [activeTab]);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [pending, rejected, admitted] = await Promise.all([
        accountancyAPI.getMyPaymentStudents(),
        accountancyAPI.getMyRejectedPaymentStudents(),
        accountancyAPI.getMyAdmittedStudents(),
      ]);
      setPendingCount(pending.length);
      setRejectedCount(rejected.length);
      setAdmittedCount(admitted.length);
    } catch (error: any) {
      console.error("Failed to fetch counts:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "pending") {
        data = await accountancyAPI.getMyPaymentStudents();
      } else if (activeTab === "rejected") {
        data = await accountancyAPI.getMyRejectedPaymentStudents();
      } else {
        data = await accountancyAPI.getMyAdmittedStudents();
      }
      setStudents(data);
    } catch (error: any) {
      console.error("Failed to fetch students:", error);
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (student: any) => {
    try {
      const details = await accountancyAPI.getPaymentDetails(student._id);
      setSelectedStudent(details);
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error("Failed to fetch student details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load student details",
      );
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    fetchCounts();
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.personal?.fullName?.toLowerCase().includes(query) ||
      student.jeeApplicationNumber?.toLowerCase().includes(query) ||
      student.user?.email?.toLowerCase().includes(query)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <AccountancySidebar />

      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                Payment Verification
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage student fee payments and admission status
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Payments
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Rejected Payments
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {rejectedCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed Admissions
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {admittedCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Pending ({pendingCount})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Rejected ({rejectedCount})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("admitted")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === "admitted"
                    ? "bg-blue-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Admitted ({admittedCount})</span>
                </div>
              </button>
            </div>

            {/* Search */}
            <div className="bg-card border border-border rounded-xl p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, JEE application number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading...</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          JEE App. No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Branch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Institute Payable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Paid Now
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Pending Verification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Remaining
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            No students found
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr
                            key={student._id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {student.jeeApplicationNumber || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {student.personal?.fullName || "N/A"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {student.user?.email || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {student.personal?.branchAllocated || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(
                                student.fee?.institutePayable || 0,
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              {formatCurrency(student.fee?.paidNow || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                              {formatCurrency(
                                student.fee?.pendingVerification || 0,
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              {formatCurrency(student.fee?.remaining || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(student)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Student Details Dialog */}
      {selectedStudent && (
        <StudentDetailsDialog
          student={selectedStudent}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedStudent(null);
          }}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default AccountancyDashboard;
