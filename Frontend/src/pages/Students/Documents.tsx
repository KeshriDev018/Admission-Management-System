import { motion } from "framer-motion";
import { Download, Upload, FileText } from "lucide-react";
import StudentSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Documents = () => {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Documents
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload and manage your documents
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Input type="file" className="text-xs sm:text-sm h-9 sm:h-10" />
              <Button className="h-9 sm:h-10 text-xs sm:text-sm whitespace-nowrap">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
              Your Documents
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              List of uploaded documents and their verification status
            </p>
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: "Passport Photo", status: "Approved" },
                { name: "Class 10 Marksheet", status: "Pending" },
                { name: "Class 12 Marksheet", status: "Rejected" },
              ].map((d) => (
                <div
                  key={d.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-xl hover:shadow-md transition-all duration-300 bg-card/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">
                        {d.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            d.status === "Approved"
                              ? "text-green-600"
                              : d.status === "Pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-12 sm:ml-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                    >
                      View
                    </Button>
                    {d.status === "Rejected" && (
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Reupload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Documents;
