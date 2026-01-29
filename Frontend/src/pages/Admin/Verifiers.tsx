import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  User,
  UserPlus,
  UserCheck,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AdminSidebar from "./Sidebar";
import { toast } from "sonner";

type Verifier = {
  id: string;
  name: string;
  email: string;
  password: string; // stored for dummy/demo purposes
  role: "verifier" | "lead";
  active: boolean;
  assigned: string[];
};

const sampleApplications = [
  { id: "IIITDWD-2025-00156", name: "Priya Sharma" },
  { id: "IIITDWD-2025-00155", name: "Amit Kumar" },
  { id: "IIITDWD-2025-00154", name: "Sara Ahmed" },
  { id: "IIITDWD-2025-00153", name: "Ravi Patel" },
];

const initialVerifiers: Verifier[] = [
  {
    id: "V-001",
    name: "Sunita Rao",
    email: "sunita.rao@example.com",
    password: "Sunita@123",
    role: "verifier",
    active: true,
    assigned: ["IIITDWD-2025-00156"],
  },
  {
    id: "V-002",
    name: "Rahul Menon",
    email: "rahul.menon@example.com",
    password: "Rahul@123",
    role: "lead",
    active: true,
    assigned: [],
  },
  {
    id: "V-003",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    password: "Neha@123",
    role: "verifier",
    active: false,
    assigned: ["IIITDWD-2025-00155"],
  },
];

const Verifiers = () => {
  const [verifiers, setVerifiers] = useState<Verifier[]>(initialVerifiers);
  const [query, setQuery] = useState("");

  // Add verifier dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Verifier["role"]>("verifier");

  // Assign dialog
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Verifier | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const filtered = verifiers.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.email.toLowerCase().includes(query.toLowerCase()) ||
      v.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName || !newEmail)
      return toast.error("Please fill required fields");
    if (!newPassword)
      return toast.error("Please provide a password for the verifier");
    const id = `V-${String(Math.floor(Math.random() * 900) + 100)}`;
    const created: Verifier = {
      id,
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      active: true,
      assigned: [],
    };
    setVerifiers((s) => [created, ...s]);
    setIsAddOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    toast.success("Verifier added");
  };

  const handleToggleActive = (id: string) => {
    setVerifiers((s) =>
      s.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
    toast.success("Status updated");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete verifier?")) return;
    setVerifiers((s) => s.filter((v) => v.id !== id));
    toast.success("Deleted");
  };

  const openAssign = (verifier: Verifier) => {
    setAssignTarget(verifier);
    setSelectedApps(verifier.assigned);
    setIsAssignOpen(true);
  };

  const handleAssign = () => {
    if (!assignTarget) return;
    setVerifiers((s) =>
      s.map((v) =>
        v.id === assignTarget.id ? { ...v, assigned: selectedApps } : v
      )
    );
    setIsAssignOpen(false);
    toast.success("Applications assigned");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Verifiers
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage verifiers and assignments
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 w-full sm:w-48 md:w-64 h-9 text-sm"
                />
              </div>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Verifier</DialogTitle>
                    <DialogDescription>
                      Add a new verifier account
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
                          setNewRole(e.target.value as Verifier["role"])
                        }
                        className="form-select rounded-md border px-3 py-2 bg-card text-foreground"
                      >
                        <option value="verifier">Verifier</option>
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
                size="sm"
                className="sm:size-default text-xs sm:text-sm h-9 sm:h-10 whitespace-nowrap"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add
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
            <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Verifier Accounts
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create, edit, deactivate and assign applications to verifiers
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
                  {filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                        {v.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                        {v.name}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {v.email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {v.role}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {v.assigned.length}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {v.active ? (
                          <Badge className="bg-success/10 text-success border-success/20 text-[10px] sm:text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] sm:text-xs">
                            Disabled
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Assign"
                          onClick={() => openAssign(v)}
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
                          onClick={() => handleToggleActive(v.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          {v.active ? (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                          ) : (
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
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
                Showing {filtered.length} verifiers
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Assign Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Applications</DialogTitle>
            <DialogDescription>
              Assign one or more applications to {assignTarget?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {sampleApplications.map((app) => (
              <label
                key={app.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/10"
              >
                <input
                  type="checkbox"
                  checked={selectedApps.includes(app.id)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedApps((s) => [...s, app.id]);
                    else
                      setSelectedApps((s) => s.filter((id) => id !== app.id));
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {app.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{app.id}</div>
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

export default Verifiers;
