import { useState, useEffect } from "react";
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
  Loader2,
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
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

// Category colors for charts
const CATEGORY_COLORS: Record<string, string> = {
  General: "hsl(222, 65%, 25%)",
  "OBC-NCL": "hsl(38, 92%, 50%)",
  SC: "hsl(142, 76%, 36%)",
  ST: "hsl(199, 89%, 48%)",
  EWS: "hsl(0, 84%, 60%)",
};

const GENDER_COLORS: Record<string, string> = {
  Male: "hsl(222, 47%, 50%)",
  Female: "hsl(340, 82%, 52%)",
  Other: "hsl(280, 60%, 50%)",
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getDashboardStats();
      setDashboardData(data);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Transform category stats for chart
  const categoryData =
    dashboardData?.categoryStats?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
      color: CATEGORY_COLORS[item._id] || "hsl(0, 0%, 50%)",
    })) || [];

  // Transform state stats for chart (backend already limits to top 6)
  const stateData =
    dashboardData?.stateStats?.map((item: any) => ({
      state: item._id || "Unknown",
      count: item.count,
    })) || [];

  // Transform gender stats
  const genderData =
    dashboardData?.genderStats?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
      color: GENDER_COLORS[item._id] || "hsl(0, 0%, 50%)",
    })) || [];

  // Fee payment data
  const feeData = dashboardData?.paymentStats
    ? [
        {
          status: "Paid",
          count: dashboardData.paymentStats.paid,
          color: "hsl(142, 76%, 36%)",
        },
        {
          status: "Half Paid",
          count: dashboardData.paymentStats.halfPaid,
          color: "hsl(38, 92%, 50%)",
        },
        {
          status: "Not Paid",
          count: dashboardData.paymentStats.notPaid,
          color: "hsl(0, 84%, 60%)",
        },
      ]
    : [];

  // Recent applications
  const recentApplications = dashboardData?.recentApplications || [];

  // Calculate gender percentages
  const totalGender = genderData.reduce(
    (sum: number, item: any) => sum + item.value,
    0,
  );
  const maleData = genderData.find((g: any) => g.name === "Male");
  const femaleData = genderData.find((g: any) => g.name === "Female");
  const malePercentage =
    totalGender > 0 && maleData
      ? Math.round((maleData.value / totalGender) * 100)
      : 0;
  const femalePercentage =
    totalGender > 0 && femaleData
      ? Math.round((femaleData.value / totalGender) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AdminSidebar />
        <div className="lg:ml-64 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending_verification: {
        label: "Pending",
        className: "bg-warning/10 text-warning border-warning/20",
      },
      verified: {
        label: "Verified",
        className: "bg-success/10 text-success border-success/20",
      },
      document_verified: {
        label: "Doc Verified",
        className: "bg-info/10 text-info border-info/20",
      },
      payment_pending: {
        label: "Payment Pending",
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
      admitted: {
        label: "Admitted",
        className: "bg-success/10 text-success border-success/20",
      },
      rejected: {
        label: "Rejected",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-muted/10 text-muted-foreground border-muted/20",
    };

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  // Get summary stats safely
  const summary = dashboardData?.summary || {
    totalApplications: 0,
    verified: 0,
    pending: 0,
    todayApps: 0,
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
                value: summary.totalApplications.toLocaleString(),
                change: "+12%",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: FileCheck,
                label: "Verified",
                value: summary.verified.toLocaleString(),
                change: "+8%",
                color: "bg-success/10 text-success",
              },
              {
                icon: TrendingUp,
                label: "Pending",
                value: summary.pending.toLocaleString(),
                change: "-5%",
                color: "bg-warning/10 text-warning",
              },
              {
                icon: UserPlus,
                label: "Today's Apps",
                value: summary.todayApps.toLocaleString(),
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
                {feeData.map((item) => {
                  const totalApps = summary.totalApplications || 1;
                  return (
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
                              width: `${(item.count / totalApps) * 100}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                {maleData && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {malePercentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Male</p>
                    <p className="text-lg font-semibold text-foreground">
                      {maleData.value.toLocaleString()}
                    </p>
                  </div>
                )}
                {femaleData && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-accent">
                        {femalePercentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Female</p>
                    <p className="text-lg font-semibold text-foreground">
                      {femaleData.value.toLocaleString()}
                    </p>
                  </div>
                )}
                {!maleData && !femaleData && (
                  <p className="text-sm text-muted-foreground">
                    No data available
                  </p>
                )}
              </div>
            </motion.div>

            {/* Area Type - Hidden since backend doesn't provide this data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Application Status
              </h3>
              <div className="flex items-center justify-center gap-4 sm:gap-8 h-32">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-success">
                      {summary.totalApplications > 0
                        ? Math.round(
                            (summary.verified / summary.totalApplications) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-lg font-semibold text-foreground">
                    {summary.verified.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-info">
                      {summary.totalApplications > 0
                        ? Math.round(
                            (summary.pending / summary.totalApplications) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg font-semibold text-foreground">
                    {summary.pending.toLocaleString()}
                  </p>
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
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app: any) => (
                      <tr
                        key={app._id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                          {app.jeeApplicationNumber || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                          {app.personal?.fullName || app.user?.name || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                          {app.personal?.category || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                          {app.personal?.state || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          {getStatusBadge(app.admissionStatus)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <Link to="/admin/students">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 sm:h-8"
                            >
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 sm:px-6 py-8 text-center text-sm text-muted-foreground"
                      >
                        No recent applications
                      </td>
                    </tr>
                  )}
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
