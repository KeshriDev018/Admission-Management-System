import { useState } from "react";
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

const applications = [
  {
    id: "IIITDWD-2025-00156",
    name: "Priya Sharma",
    status: "pending",
    category: "General",
    state: "Karnataka",
    documents: [
      { name: "Passport Photo", status: "pending", url: "#" },
      { name: "Class 10 Marksheet", status: "pending", url: "#" },
      { name: "Class 12 Marksheet", status: "pending", url: "#" },
      { name: "Aadhar Card", status: "pending", url: "#" },
    ],
  },
  {
    id: "IIITDWD-2025-00155",
    name: "Amit Kumar",
    status: "pending",
    category: "OBC-NCL",
    state: "Maharashtra",
    documents: [
      { name: "Passport Photo", status: "verified", url: "#" },
      { name: "Class 10 Marksheet", status: "verified", url: "#" },
      { name: "Class 12 Marksheet", status: "pending", url: "#" },
      { name: "Caste Certificate", status: "pending", url: "#" },
    ],
  },
  {
    id: "IIITDWD-2025-00154",
    name: "Sara Ahmed",
    status: "pending",
    category: "General",
    state: "Telangana",
    documents: [
      { name: "Passport Photo", status: "verified", url: "#" },
      {
        name: "Class 10 Marksheet",
        status: "rejected",
        url: "#",
        remark: "Image not clear",
      },
      { name: "Class 12 Marksheet", status: "pending", url: "#" },
    ],
  },
];

const VerifierDashboard = () => {
  const [selectedApplication, setSelectedApplication] = useState<
    (typeof applications)[0] | null
  >(null);
  const [remark, setRemark] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVerify = (docName: string) => {
    toast.success(`${docName} verified successfully`);
  };

  const handleReject = (docName: string) => {
    if (!remark.trim()) {
      toast.error("Please add a remark for rejection");
      return;
    }
    toast.success(`${docName} rejected with remark`);
    setRemark("");
  };

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
                value: "12",
                color: "bg-warning/10 text-warning",
              },
              {
                icon: CheckCircle,
                label: "Verified Today",
                value: "8",
                color: "bg-success/10 text-success",
              },
              {
                icon: XCircle,
                label: "Rejected Today",
                value: "2",
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
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
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
                        {app.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {app.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {app.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {app.state}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsDialogOpen(true);
                      }}
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
                <div className="flex flex-wrap gap-2">
                  {app.documents.map((doc, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm ${
                        doc.status === "verified"
                          ? "bg-success/10 text-success"
                          : doc.status === "rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {doc.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Document Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Verification</DialogTitle>
            <DialogDescription>
              Review documents for {selectedApplication?.name} (
              {selectedApplication?.id})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedApplication?.documents.map((doc, index) => (
              <div key={index} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Click to view document
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                {doc.status === "pending" && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add remark (required for rejection)..."
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerify(doc.name)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleReject(doc.name)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
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
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifierDashboard;
