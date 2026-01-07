import StudentSidebar from "./Sidebar";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Recent notifications and alerts for your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default text-xs sm:text-sm h-8 sm:h-10"
              >
                Mark all read
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
              Activity
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              Recent notifications and updates
            </p>

            <div className="space-y-3 sm:space-y-4">
              {[
                { title: "Application verified", time: "2d" },
                { title: "Fee payment received", time: "5d" },
              ].map((n, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 sm:p-4 border rounded-xl hover:shadow-md transition-all duration-300 bg-card/50"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 sm:p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex-shrink-0">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base">
                        {n.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {n.time} ago
                      </div>
                    </div>
                  </div>
                  <div className="ml-11 sm:ml-0">
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                    >
                      View
                    </Button>
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

export default Notifications;
