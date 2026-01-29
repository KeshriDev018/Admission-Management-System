import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import AccountancySidebar from "./Sidebar";

const students = [
  {
    id: "IIITDWD-2025-00156",
    name: "Priya Sharma",
    feeStatus: "not_paid",
    category: "General",
    course: "B.Tech CSE",
    totalFee: 150000,
    paidAmount: 0,
  },
  {
    id: "IIITDWD-2025-00155",
    name: "Amit Kumar",
    feeStatus: "half_paid",
    category: "OBC-NCL",
    course: "B.Tech ECE",
    totalFee: 125000,
    paidAmount: 62500,
    remark: "First installment received via SBI Collect",
  },
  {
    id: "IIITDWD-2025-00154",
    name: "Sara Ahmed",
    feeStatus: "paid",
    category: "General",
    course: "B.Tech CSE",
    totalFee: 150000,
    paidAmount: 150000,
    remark: "Full payment received",
  },
  {
    id: "IIITDWD-2025-00153",
    name: "Ravi Patel",
    feeStatus: "not_paid",
    category: "EWS",
    course: "B.Tech IT",
    totalFee: 75000,
    paidAmount: 0,
  },
];

const AccountancyDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }
    toast.success("Fee status updated successfully");
    setIsDialogOpen(false);
    setNewStatus("");
    setRemark("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Fully Paid
          </Badge>
        );
      case "half_paid":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Partially Paid
          </Badge>
        );
      case "not_paid":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Not Paid
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AccountancySidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Fee Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and update student payment status
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center text-warning-foreground font-semibold">
                AC
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: DollarSign,
                label: "Total Collection",
                value: "₹2.4 Cr",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: CheckCircle,
                label: "Fully Paid",
                value: "156",
                color: "bg-success/10 text-success",
              },
              {
                icon: Clock,
                label: "Partially Paid",
                value: "42",
                color: "bg-warning/10 text-warning",
              },
              {
                icon: XCircle,
                label: "Not Paid",
                value: "82",
                color: "bg-destructive/10 text-destructive",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Application ID or Name..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Fully Paid</SelectItem>
                <SelectItem value="half_paid">Half Paid</SelectItem>
                <SelectItem value="not_paid">Not Paid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Total Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {student.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {formatCurrency(student.totalFee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-success font-medium">
                        {formatCurrency(student.paidAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-destructive font-medium">
                        {formatCurrency(student.totalFee - student.paidAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(student.feeStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDialogOpen(true);
                          }}
                        >
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Fee Status</DialogTitle>
            <DialogDescription>
              Update payment status for {selectedStudent?.name} (
              {selectedStudent?.id})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Fee:</span>
                <span className="font-medium text-foreground">
                  {selectedStudent && formatCurrency(selectedStudent.totalFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid Amount:</span>
                <span className="font-medium text-success">
                  {selectedStudent &&
                    formatCurrency(selectedStudent.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-medium text-destructive">
                  {selectedStudent &&
                    formatCurrency(
                      selectedStudent.totalFee - selectedStudent.paidAmount
                    )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                New Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Fully Paid</SelectItem>
                  <SelectItem value="half_paid">Half Paid</SelectItem>
                  <SelectItem value="not_paid">Not Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Remark
              </label>
              <Textarea
                placeholder="Add payment remarks (e.g., SBI Collect transaction ID)..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountancyDashboard;
