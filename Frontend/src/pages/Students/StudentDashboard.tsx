import { motion } from "framer-motion";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StudentSidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const StudentDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const applicationStatus = user?.applicationStatus || "pending"; // pending, verified, rejected
  const feeStatus = user?.feeStatus || "not_paid"; // paid, half_paid, not_paid

  const documents = [
    { name: "Passport Photo", status: "verified" },
    { name: "Class 10 Marksheet", status: "verified" },
    { name: "Class 12 Marksheet", status: "pending" },
    {
      name: "Caste Certificate",
      status: "rejected",
      remark: "Image is not clear, please re-upload",
    },
    { name: "Income Certificate", status: "pending" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
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
                Welcome, {user?.fullName || "Student"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Application ID:{" "}
                {user?._id
                  ? `IIITDWD-2025-${user._id.slice(-5).toUpperCase()}`
                  : "N/A"}
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
                {getInitials(user?.fullName || "")}
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
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                </div>
                {getStatusBadge(applicationStatus)}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Application Status
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Your application is under review
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
                  3/5 Verified
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Document Verification
              </h3>
              <Progress value={60} className="mt-3 h-2 bg-muted" />
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
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  Not Paid
                </Badge>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Fee Payment
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                ₹1,50,000 pending
              </p>
            </motion.div>
          </div>

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
              {documents.map((doc, index) => (
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
                    {doc.status === "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm h-8"
                      >
                        Re-upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default StudentDashboard;
