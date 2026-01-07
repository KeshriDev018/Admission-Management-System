import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  GraduationCap,
  Clock,
  CheckCircle,
  LogOut,
  XCircle,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountancySidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/accountancy",
    },
    {
      icon: Clock,
      label: "Pending Payments",
      count: 12,
      link: "/accountancy/pending",
    },
    {
      icon: CheckCircle,
      label: "Approved",
      count: 45,
      link: "/accountancy/approved",
    },
    {
      icon: XCircle,
      label: "Rejected",
      count: 8,
      link: "/accountancy/rejected",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground p-4 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block`}
      >
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary overflow-hidden flex items-center justify-center">
            <img
              src="/logo.png"
              alt="IDAP Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">IDAP</h1>
            <p className="text-xs text-sidebar-foreground/60">
              Accountancy Portal
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <Link
                key={item.label}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.count && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "bg-sidebar-accent"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AccountancySidebar;
