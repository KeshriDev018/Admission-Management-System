import { useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Settings = () => {
  // Organization
  const [orgName, setOrgName] = useState("PAMS Institute");
  const [contactEmail, setContactEmail] = useState("admin@example.com");
  const [contactPhone, setContactPhone] = useState("+91-9876543210");

  // Authentication
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  const [allowSelfRegistration, setAllowSelfRegistration] = useState(false);

  // Notifications / SMTP
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  // Roles & Features
  const [allowAccountancyAccess, setAllowAccountancyAccess] = useState(true);
  const [allowVerifierAccess, setAllowVerifierAccess] = useState(true);

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const handleSave = () => {
    // In real app: send to API; here we just show a toast
    toast.success("Settings saved (demo)");
  };

  const handleReset = () => {
    setOrgName("PAMS Institute");
    setContactEmail("admin@example.com");
    setContactPhone("+91-9876543210");
    setMinPasswordLength(8);
    setSessionTimeout(30);
    setAllowSelfRegistration(false);
    setEmailNotifications(true);
    setSmtpHost("");
    setSmtpPort(587);
    setSmtpUser("");
    setSmtpPass("");
    setAllowAccountancyAccess(true);
    setAllowVerifierAccess(true);
    setTheme("system");
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Admin settings and preferences
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Organization */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Organization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organization Name"
              />
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Contact Email"
              />
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Contact Phone"
              />
            </div>
          </motion.div>

          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Authentication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-sm text-muted-foreground">
                  Min. password length
                </label>
                <Input
                  type="number"
                  value={minPasswordLength}
                  onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Session timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={allowSelfRegistration}
                  onCheckedChange={(val) =>
                    setAllowSelfRegistration(Boolean(val))
                  }
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Allow self-registration
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Enable to let applicants create accounts
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications / SMTP */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Notifications & Email
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <Switch
                checked={emailNotifications}
                onCheckedChange={(v) => setEmailNotifications(Boolean(v))}
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  Email notifications
                </div>
                <div className="text-xs text-muted-foreground">
                  Enable system email notifications
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="SMTP Host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
              <Input
                placeholder="SMTP Port"
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
              />
              <Input
                placeholder="SMTP Username"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
              />
              <Input
                placeholder="SMTP Password"
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Roles & Access */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Roles & Feature Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={allowAccountancyAccess}
                  onCheckedChange={(v) => setAllowAccountancyAccess(Boolean(v))}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Accountancy Access
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Toggle whether accountancy module is available to assigned
                    users
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={allowVerifierAccess}
                  onCheckedChange={(v) => setAllowVerifierAccess(Boolean(v))}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Verifier Access
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Toggle whether verifier module is available to assigned
                    users
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Appearance
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="form-select rounded-md border px-3 py-2 bg-card text-foreground"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
