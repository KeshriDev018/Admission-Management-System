import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import AdminSidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const genderData = [
  { name: "Male", value: 2034, color: "hsl(222, 65%, 25%)" },
  { name: "Female", value: 1246, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 15, color: "hsl(142, 76%, 36%)" },
];

const stateData = [
  { state: "Karnataka", male: 520, female: 330 },
  { state: "Maharashtra", male: 360, female: 260 },
  { state: "Telangana", male: 280, female: 200 },
  { state: "Tamil Nadu", male: 230, female: 180 },
  { state: "AP", male: 210, female: 170 },
  { state: "Kerala", male: 160, female: 130 },
  { state: "Gujarat", male: 120, female: 100 },
];

const programRanks = [
  { program: "B.Tech CSE", opening: 120, closing: 8200, seats: 120 },
  { program: "B.Tech ECE", opening: 220, closing: 9200, seats: 100 },
  { program: "B.Sc Data Science", opening: 340, closing: 15000, seats: 60 },
  { program: "M.Tech CSE", opening: 15, closing: 400, seats: 30 },
];

const totals = {
  total: stateData.reduce((s, st) => s + (st.male + st.female), 0),
  male: stateData.reduce((s, st) => s + st.male, 0),
  female: stateData.reduce((s, st) => s + st.female, 0),
};

const arrayToCSV = (arr: any[]) => {
  if (!arr || arr.length === 0) return "";
  const keys = Object.keys(arr[0]);
  const lines = [keys.join(",")];
  arr.forEach((row) => {
    const vals = keys.map((k) => {
      const v = row[k];
      if (v === null || v === undefined) return "";
      return `"${String(v).replace(/"/g, '""')}"`;
    });
    lines.push(vals.join(","));
  });
  return lines.join("\n");
};

const downloadCSV = (arr: any[], filename: string) => {
  const csv = arrayToCSV(arr);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredStates = stateData.filter((s) =>
    s.state.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Reports
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Admissions & finance reports
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search state..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48 h-9"
                />
              </div>

              <div className="flex gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-40 h-9"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-40 h-9"
                />
              </div>

              <Button
                onClick={() =>
                  downloadCSV(
                    [
                      {
                        total: totals.total,
                        male: totals.male,
                        female: totals.female,
                      },
                    ],
                    "summary.csv"
                  )
                }
                className="h-9 sm:h-10"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">Download Summary</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Totals
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {totals.total}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Male
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-foreground">
                    {totals.male}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Female
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-foreground">
                    {totals.female}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Gender Distribution
              </h3>
              <div className="h-32 sm:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                    >
                      {genderData.map((entry, i) => (
                        <Cell key={`c-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 sm:mt-4 flex gap-2">
                <Button
                  onClick={() =>
                    downloadCSV(genderData, "gender_distribution.csv")
                  }
                  className="h-8 sm:h-10 w-full sm:w-auto"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Download CSV</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Opening/Closing Ranks
              </h3>
              <div className="overflow-x-auto max-h-32 sm:max-h-40 -mx-4 sm:mx-0">
                <table className="w-full min-w-[400px] text-xs sm:text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs">
                        Program
                      </th>
                      <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs">
                        Opening
                      </th>
                      <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs">
                        Closing
                      </th>
                      <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs">
                        Seats
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {programRanks.map((r) => (
                      <tr key={r.program} className="hover:bg-muted/30">
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                          {r.program}
                        </td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                          {r.opening}
                        </td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                          {r.closing}
                        </td>
                        <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                          {r.seats}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 sm:mt-4 flex gap-2">
                <Button
                  onClick={() => downloadCSV(programRanks, "ranks.csv")}
                  className="h-8 sm:h-10 w-full sm:w-auto"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Download CSV</span>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  State-wise Applications
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Filtered by search and date range (demo)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() =>
                    downloadCSV(filteredStates, "state_distribution.csv")
                  }
                  className="h-8 sm:h-10 w-full sm:w-auto"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Download CSV</span>
                </Button>
                <Button
                  onClick={() =>
                    downloadCSV(stateData, "state_distribution_full.csv")
                  }
                  variant="outline"
                  className="h-8 sm:h-10 w-full sm:w-auto"
                >
                  <span className="text-xs sm:text-sm">Export Full</span>
                </Button>
              </div>
            </div>

            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStates}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="state"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="male"
                    fill="hsl(222 65% 25%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="female"
                    fill="hsl(38 92% 50%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
