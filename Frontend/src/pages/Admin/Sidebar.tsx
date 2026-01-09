import {
  GraduationCap,
  Users,
  FileCheck,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    icon: TrendingUp,
    label: "CSAB Admission Insights",
    to: "/admin/csab-analytics",
  },
  { icon: BarChart3, label: "Admission Dashboard", to: "/admin" },
  { icon: Users, label: "Students", to: "/admin/students" },
  { icon: FileCheck, label: "Verifiers", to: "/admin/verifiers" },
  { icon: CreditCard, label: "Accountancy", to: "/admin/accountancy" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-2 right-2 z-[60] lg:hidden p-2.5 rounded-lg bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition-all"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
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
        <NavLink
          to="/"
          className="flex items-center gap-3 mb-8 px-2 no-underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary overflow-hidden flex items-center justify-center">
            <img
              src="/logo.png"
              alt="IDAP Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">IDAP</h1>
            <p className="text-xs text-sidebar-foreground/60">Admin Portal</p>
          </div>
        </NavLink>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/admin"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
