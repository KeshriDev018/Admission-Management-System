import { motion } from "framer-motion";
import { Search, Filter, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import AdminSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Student = {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  status: "enrolled" | "graduated" | "dropped";
};

const students: Student[] = [
  {
    id: "IIITDWD-2025-00101",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    program: "B.Tech CSE",
    year: 2025,
    status: "enrolled",
  },
  {
    id: "IIITDWD-2025-00102",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    program: "B.Tech ECE",
    year: 2025,
    status: "enrolled",
  },
  {
    id: "IIITDWD-2024-00098",
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    program: "B.Sc Data Science",
    year: 2024,
    status: "graduated",
  },
  {
    id: "IIITDWD-2023-00075",
    name: "Ravi Patel",
    email: "ravi.patel@example.com",
    program: "B.Tech ME",
    year: 2023,
    status: "dropped",
  },
  {
    id: "IIITDWD-2025-00103",
    name: "Ananya Reddy",
    email: "ananya.reddy@example.com",
    program: "B.Com Hons",
    year: 2025,
    status: "enrolled",
  },
  {
    id: "IIITDWD-2024-00100",
    name: "Karan Singh",
    email: "karan.singh@example.com",
    program: "B.Tech CSE",
    year: 2024,
    status: "graduated",
  },
  {
    id: "IIITDWD-2025-00104",
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    program: "B.A. English",
    year: 2025,
    status: "enrolled",
  },
  {
    id: "IIITDWD-2022-00045",
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    program: "M.Tech CSE",
    year: 2022,
    status: "graduated",
  },
];

const getStatusBadge = (status: Student["status"]) => {
  switch (status) {
    case "enrolled":
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          Enrolled
        </Badge>
      );
    case "graduated":
      return (
        <Badge className="bg-info/10 text-info border-info/20">Graduated</Badge>
      );
    case "dropped":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          Dropped
        </Badge>
      );
    default:
      return null;
  }
};

const Students = () => {
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
                  placeholder="Search..."
                  className="pl-9 w-full sm:w-48 md:w-64 h-9 text-sm"
                />
              </div>
              <Button
                size="sm"
                className="sm:size-default text-xs sm:text-sm h-9 sm:h-10 whitespace-nowrap"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
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
                  List of registered students
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 w-full sm:w-48 md:w-64 h-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Year
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
                  {students.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                        {s.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                        {s.name}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {s.email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {s.program}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {s.year}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
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
                          title="Delete"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {students.length} students
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Prev
                </Button>
                <Button size="sm" className="text-xs h-8">
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Students;
