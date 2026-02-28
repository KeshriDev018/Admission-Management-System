import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  User,
  UserCheck,
  Search,
  Loader2,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminSidebar from "./Sidebar";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";

type Verifier = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
};

const Verifiers = () => {
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Add verifier dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // View assigned students
  const [isViewStudentsOpen, setIsViewStudentsOpen] = useState(false);
  const [selectedVerifierId, setSelectedVerifierId] = useState<string | null>(
    null,
  );
  const [selectedVerifierName, setSelectedVerifierName] = useState("");
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  useEffect(() => {
    fetchVerifiers();
  }, []);

  const fetchVerifiers = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getAllVerifiers();
      setVerifiers(data.verifiers || []);
    } catch (error: any) {
      console.error("Failed to fetch verifiers:", error);
      toast.error(error.response?.data?.message || "Failed to load verifiers");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = verifiers.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.email.toLowerCase().includes(query.toLowerCase()) ||
      v._id.toLowerCase().includes(query.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsCreating(true);
      await adminAPI.createStaff({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword.trim(),
        role: "verifier",
      });

      toast.success("Verifier created successfully!");
      setIsAddOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      fetchVerifiers();
    } catch (error: any) {
      console.error("Failed to create verifier:", error);
      toast.error(error.response?.data?.message || "Failed to create verifier");
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewStudents = async (verifierId: string, name: string) => {
    try {
      setSelectedVerifierId(verifierId);
      setSelectedVerifierName(name);
      setIsViewStudentsOpen(true);
      setIsLoadingStudents(true);
      const data = await adminAPI.getVerifierStudents(verifierId);
      setAssignedStudents(data.students || []);
    } catch (error: any) {
      console.error("Failed to fetch assigned students:", error);
      toast.error(
        error.response?.data?.message || "Failed to load assigned students",
      );
      setIsViewStudentsOpen(false);
    } finally {
      setIsLoadingStudents(false);
    }
  };
  const handleToggleStatus = async (
    verifierId: string,
    currentStatus: boolean,
  ) => {
    try {
      const newStatus = !currentStatus;
      await adminAPI.toggleStaffStatus(verifierId, newStatus);
      toast.success(
        `Verifier ${newStatus ? "activated" : "deactivated"} successfully`,
      );
      fetchVerifiers();
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Verifiers
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage verification team members
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search verifiers..."
                  className="pl-9 w-full sm:w-56 h-9 text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="h-9 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add Verifier
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading verifiers...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="p-4 sm:p-6 border-b border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Verification Team
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {filtered.length} verifier{filtered.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Created At
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
                    {filtered.length > 0 ? (
                      filtered.map((verifier) => (
                        <tr
                          key={verifier._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-foreground">
                                {verifier.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {verifier.email}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              {verifier.role}
                            </Badge>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                            {new Date(verifier.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <Badge
                              className={
                                verifier.isActive
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              }
                            >
                              {verifier.isActive ? (
                                <CheckCircle className="w-3 h-3 mr-1 inline" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1 inline" />
                              )}
                              {verifier.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View Assigned Students"
                                onClick={() =>
                                  handleViewStudents(
                                    verifier._id,
                                    verifier.name,
                                  )
                                }
                                className="h-7 w-7 sm:h-8 sm:w-8"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleStatus(
                                        verifier._id,
                                        verifier.isActive,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    {verifier.isActive ? (
                                      <>
                                        <XCircle className="w-4 h-4 mr-2 text-destructive" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-success" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 sm:px-6 py-8 text-center text-sm text-muted-foreground"
                        >
                          No verifiers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add Verifier Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Add New Verifier
            </DialogTitle>
            <DialogDescription>
              Create a new verifier account. They will be automatically assigned
              students based on workload.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="Enter full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="verifier@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setNewName("");
                setNewEmail("");
                setNewPassword("");
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Verifier
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Assigned Students Dialog */}
      <Dialog open={isViewStudentsOpen} onOpenChange={setIsViewStudentsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Students Assigned to {selectedVerifierName}
            </DialogTitle>
            <DialogDescription>
              List of students assigned to this verifier for verification
            </DialogDescription>
          </DialogHeader>
          {isLoadingStudents ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : assignedStudents.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                        JEE App No
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assignedStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">
                          {student.jeeApplicationNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {student.personal?.fullName || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {student.account?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            className={
                              student.admissionStatus === "verified"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {student.admissionStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: {assignedStudents.length} student
                {assignedStudents.length !== 1 ? "s" : ""}
              </p>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No students assigned yet
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Verifiers;
