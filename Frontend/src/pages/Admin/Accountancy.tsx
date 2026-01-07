import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  UserCheck,
  Search,
  Filter,
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
import AdminSidebar from "./Sidebar";
import { toast } from "sonner";

type Accountant = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "accountant" | "lead";
  active: boolean;
  assigned: string[]; // student ids
};

const sampleStudents = [
  { id: "IIITDWD-2025-00156", name: "Priya Sharma" },
  { id: "IIITDWD-2025-00155", name: "Amit Kumar" },
  { id: "IIITDWD-2025-00154", name: "Sara Ahmed" },
  { id: "IIITDWD-2025-00153", name: "Ravi Patel" },
];

const initialAccountants: Accountant[] = [
  {
    id: "A-001",
    name: "Maya Iyer",
    email: "maya.iyer@example.com",
    password: "Maya@123",
    role: "accountant",
    active: true,
    assigned: ["IIITDWD-2025-00156"],
  },
  {
    id: "A-002",
    name: "Anoop Singh",
    email: "anoop.singh@example.com",
    password: "Anoop@123",
    role: "lead",
    active: true,
    assigned: [],
  },
];

const Accountancy = () => {
  const [accountants, setAccountants] =
    useState<Accountant[]>(initialAccountants);
  const [query, setQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Accountant["role"]>("accountant");

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Accountant | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filtered = accountants.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName || !newEmail)
      return toast.error("Please fill required fields");
    if (!newPassword) return toast.error("Please provide a password");
    const id = `A-${String(Math.floor(Math.random() * 900) + 100)}`;
    const created: Accountant = {
      id,
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      active: true,
      assigned: [],
    };
    setAccountants((s) => [created, ...s]);
    setIsAddOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    toast.success("Accountant added");
  };

  const handleToggleActive = (id: string) => {
    setAccountants((s) =>
      s.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    toast.success("Status updated");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete accountant?")) return;
    setAccountants((s) => s.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  const openAssign = (acc: Accountant) => {
    setAssignTarget(acc);
    setSelectedStudents(acc.assigned);
    setIsAssignOpen(true);
  };

  const handleAssign = () => {
    if (!assignTarget) return;
    setAccountants((s) =>
      s.map((a) =>
        a.id === assignTarget.id ? { ...a, assigned: selectedStudents } : a
      )
    );
    setIsAssignOpen(false);
    toast.success("Students assigned");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Accountancy
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage accountancy staff and assignments
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search accountancy staff..."
                  className="pl-9 w-full sm:w-48 md:w-64 h-9"
                />
              </div>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Accountant</DialogTitle>
                    <DialogDescription>
                      Add a new accountancy member
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 mt-4">
                    <Input
                      placeholder="Full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">
                        Role:
                      </label>
                      <select
                        value={newRole}
                        onChange={(e) =>
                          setNewRole(e.target.value as Accountant["role"])
                        }
                        className="form-select rounded-md border px-3 py-2 bg-card text-foreground"
                      >
                        <option value="accountant">Accountant</option>
                        <option value="lead">Lead</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsAddOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAdd}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => setIsAddOpen(true)}
                className="h-9 sm:h-10"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">Add Member</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="p-4 sm:p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Accountancy Team
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create, edit, deactivate and assign students to accountancy
                  staff
                </p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[700px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      ID
                    </th>
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
                      Assigned
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
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                        {a.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                        {a.name}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {a.email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {a.role}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {a.assigned.length}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {a.active ? (
                          <Badge className="bg-success/10 text-success border-success/20 text-[10px] sm:text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] sm:text-xs">
                            Disabled
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Assign"
                          onClick={() => openAssign(a)}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Toggle Active"
                          onClick={() => handleToggleActive(a.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          {a.active ? (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                          ) : (
                            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 sm:p-4 border-t border-border flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {filtered.length} members
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Assign Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Students</DialogTitle>
            <DialogDescription>
              Assign one or more students to {assignTarget?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {sampleStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/10"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedStudents((prev) => [...prev, student.id]);
                    else
                      setSelectedStudents((prev) =>
                        prev.filter((id) => id !== student.id)
                      );
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {student.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.id}
                  </div>
                </div>
              </label>
            ))}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign}>Assign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accountancy;
