import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VerifierSidebar from "./Sidebar";

type VerifiedStudent = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  program: string;
  department: string;
  verificationDate: string;
  documents: string[];
  status: "Verified";
};

const Verified = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Demo verified students data
  const verifiedStudents: VerifiedStudent[] = [
    {
      id: "v-1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@student.com",
      rollNo: "CSE-001",
      program: "B.Tech",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-2",
      name: "Priya Sharma",
      email: "priya.sharma@student.com",
      rollNo: "ENG-002",
      program: "B.Tech",
      department: "Electronics",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-3",
      name: "Amit Patel",
      email: "amit.patel@student.com",
      rollNo: "CSE-003",
      program: "B.Sc",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-4",
      name: "Neha Gupta",
      email: "neha.gupta@student.com",
      rollNo: "ME-004",
      program: "B.Tech",
      department: "Mechanical",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-5",
      name: "Vikram Singh",
      email: "vikram.singh@student.com",
      rollNo: "EC-005",
      program: "B.Tech",
      department: "Electronics",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo"],
      status: "Verified",
    },
    {
      id: "v-6",
      name: "Sneha Reddy",
      email: "sneha.reddy@student.com",
      rollNo: "CSE-006",
      program: "B.Tech",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-7",
      name: "Arjun Verma",
      email: "arjun.verma@student.com",
      rollNo: "ME-007",
      program: "Diploma",
      department: "Mechanical",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-8",
      name: "Divya Nair",
      email: "divya.nair@student.com",
      rollNo: "CSE-008",
      program: "B.Tech",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-9",
      name: "Rohit Yadav",
      email: "rohit.yadav@student.com",
      rollNo: "ENG-009",
      program: "B.Tech",
      department: "Electronics",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-10",
      name: "Ananya Das",
      email: "ananya.das@student.com",
      rollNo: "CSE-010",
      program: "B.Sc",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo"],
      status: "Verified",
    },
    {
      id: "v-11",
      name: "Sanjay Kumar",
      email: "sanjay.kumar@student.com",
      rollNo: "ME-011",
      program: "B.Tech",
      department: "Mechanical",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 10 Marksheet", "Class 12 Marksheet"],
      status: "Verified",
    },
    {
      id: "v-12",
      name: "Pooja Mishra",
      email: "pooja.mishra@student.com",
      rollNo: "CSE-012",
      program: "B.Tech",
      department: "Computer Science",
      verificationDate: new Date().toISOString(),
      documents: ["Passport Photo", "Class 12 Marksheet"],
      status: "Verified",
    },
  ];

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return verifiedStudents.filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

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
                Verified Students
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                View all students you have verified and their details
              </p>
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
                    Total Verified
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {verifiedStudents.length}
                  </div>
                </div>
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
                    Page
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {totalPages > 0 ? currentPage : 0} / {totalPages}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Students Table */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
            >
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[800px]">
                  <thead>
                    <tr className="text-left text-[10px] sm:text-sm text-muted-foreground border-b border-border">
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Name
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Roll No
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Email
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Program
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Department
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Documents
                      </th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-semibold">
                        Verified Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td
                          className="py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground"
                          colSpan={7}
                        >
                          No verified students found matching your search.
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
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="font-medium text-xs sm:text-sm">
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {student.rollNo}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {student.email}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-[10px] sm:text-xs font-medium">
                              {student.program}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {student.department}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex gap-1 flex-wrap">
                              {student.documents.map((doc) => (
                                <span
                                  key={doc}
                                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-[10px] sm:text-xs"
                                >
                                  {doc.split(" ")[0]}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                            {formatDate(student.verificationDate)}
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
    </div>
  );
};

export default Verified;
