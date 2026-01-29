import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  UserCheck,
  Wallet,
  User,
} from "lucide-react";
import { toast } from "sonner";

type UserRole = "student" | "admin" | "verifier" | "accountancy";

const roleInfo = {
  student: {
    icon: User,
    label: "Student",
    description: "Access your application",
  },
  admin: {
    icon: Shield,
    label: "Administrator",
    description: "Full system control",
  },
  verifier: {
    icon: UserCheck,
    label: "Verifier",
    description: "Document verification",
  },
  accountancy: {
    icon: Wallet,
    label: "Accountancy",
    description: "Fee management",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:8081/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: selectedRole }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Login failed");
      setIsLoading(false);
      return;
    }

    toast.success("Login successful!");

    // Navigate based on role
    switch (data.role) {
      case "admin":
        navigate("/admin");
        break;
      case "verifier":
        navigate("/verifier");
        break;
      case "accountancy":
        navigate("/accountancy");
        break;
      default:
        navigate("/student");
    }
    console.log(data.role);
  } catch (err) {
    toast.error("Server not reachable");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <Link
          to="/"
          className="relative flex items-center gap-3 text-primary-foreground hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="IDAP Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                IDAP
              </h1>
              <p className="text-primary-foreground/60">IIIT Dharwad</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-primary-foreground/70 max-w-md">
            Access your admission portal and track your application status in
            real-time.
          </p>
        </div>

        <p className="relative text-sm text-primary-foreground/50">
          © 2025 IIIT Dharwad. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-foreground">PAMS</h1>
                  <p className="text-xs text-muted-foreground">IIIT Dharwad</p>
                </div>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
            <p className="text-muted-foreground mb-6">
              Choose your role and enter credentials
            </p>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(Object.keys(roleInfo) as UserRole[]).map((role) => {
                const RoleIcon = roleInfo[role].icon;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedRole === role
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <RoleIcon
                      className={`w-5 h-5 mb-1 ${
                        selectedRole === role
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        selectedRole === role
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {roleInfo[role].label}
                    </p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Apply Now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
