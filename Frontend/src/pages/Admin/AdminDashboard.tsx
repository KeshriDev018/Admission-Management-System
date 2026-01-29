import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  FileCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  UserPlus,
  FileText,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const categoryData = [
  { name: "General", value: 1250, color: "hsl(222, 65%, 25%)" },
  { name: "OBC-NCL", value: 980, color: "hsl(38, 92%, 50%)" },
  { name: "SC", value: 450, color: "hsl(142, 76%, 36%)" },
  { name: "ST", value: 320, color: "hsl(199, 89%, 48%)" },
  { name: "EWS", value: 280, color: "hsl(0, 84%, 60%)" },
];

const stateData = [
  { state: "Karnataka", count: 850 },
  { state: "Maharashtra", count: 620 },
  { state: "Telangana", count: 480 },
  { state: "Tamil Nadu", count: 410 },
  { state: "AP", count: 380 },
  { state: "Kerala", count: 290 },
];

const feeData = [
  { status: "Paid", count: 1850, color: "hsl(142, 76%, 36%)" },
  { status: "Half Paid", count: 620, color: "hsl(38, 92%, 50%)" },
  { status: "Not Paid", count: 810, color: "hsl(0, 84%, 60%)" },
];

const recentApplications = [
  {
    id: "IIITDWD-2025-00156",
    name: "Priya Sharma",
    status: "pending",
    category: "General",
    state: "Karnataka",
  },
  {
    id: "IIITDWD-2025-00155",
    name: "Amit Kumar",
    status: "verified",
    category: "OBC-NCL",
    state: "Maharashtra",
  },
  {
    id: "IIITDWD-2025-00154",
    name: "Sara Ahmed",
    status: "rejected",
    category: "General",
    state: "Telangana",
  },
  {
    id: "IIITDWD-2025-00153",
    name: "Ravi Patel",
    status: "pending",
    category: "EWS",
    state: "Gujarat",
  },
  {
    id: "IIITDWD-2025-00152",
    name: "Ananya Reddy",
    status: "verified",
    category: "SC",
    state: "AP",
  },
];

const AdminDashboard = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

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
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Admission Statistics & Management
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default text-xs sm:text-sm h-8 sm:h-10"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Export
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                icon: Users,
                label: "Total Applications",
                value: "3,280",
                change: "+12%",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: FileCheck,
                label: "Verified",
                value: "1,850",
                change: "+8%",
                color: "bg-success/10 text-success",
              },
              {
                icon: TrendingUp,
                label: "Pending",
                value: "1,120",
                change: "-5%",
                color: "bg-warning/10 text-warning",
              },
              {
                icon: UserPlus,
                label: "Today's Apps",
                value: "42",
                change: "+23%",
                color: "bg-info/10 text-info",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-inner`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-success">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Category-wise Distribution
              </h3>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* State-wise Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                State-wise Applications
              </h3>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      dataKey="state"
                      type="category"
                      width={80}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Fee Status & Gender Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Fee Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Fee Payment Status
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {feeData.map((item) => (
                  <div key={item.status} className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {item.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.count / 3280) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gender Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Gender Distribution
              </h3>
              <div className="flex items-center justify-center gap-4 sm:gap-8 h-32">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-primary">62%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Male</p>
                  <p className="text-lg font-semibold text-foreground">2,034</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-accent">38%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Female</p>
                  <p className="text-lg font-semibold text-foreground">1,246</p>
                </div>
              </div>
            </motion.div>

            {/* Area Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Rural vs Urban
              </h3>
              <div className="flex items-center justify-center gap-4 sm:gap-8 h-32">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-success">45%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rural</p>
                  <p className="text-lg font-semibold text-foreground">1,476</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-info">55%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Urban</p>
                  <p className="text-lg font-semibold text-foreground">1,804</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Applications Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Recent Applications
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Latest student applications
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 w-full sm:w-64 h-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      State
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
                  {recentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                        {app.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                        {app.name}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {app.category}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                        {app.state}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 sm:h-8"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
