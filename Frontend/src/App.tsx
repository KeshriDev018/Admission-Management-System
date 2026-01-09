import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/Students/StudentDashboard";
import Documents from "./pages/Students/Documents";
import FeePayments from "./pages/Students/FeePayments";
import Notifications from "./pages/Students/Notifications";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Students from "./pages/Admin/Students";
import Verifiers from "./pages/Admin/Verifiers";
import AdminAccountancy from "./pages/Admin/Accountancy";
import Settings from "./pages/Admin/Settings";
import CSABAnalytics from "./pages/Admin/CSABAnalytics";
import VerifierDashboard from "./pages/Verifier/VerifierDashboard";
import Verified from "./pages/Verifier/verified";
import Rejected from "./pages/Verifier/rejected";
import AccountancyDashboard from "./pages/Accountancy/AccountancyDashboard";
import NotFound from "./pages/NotFound";
import Pending from "./pages/Accountancy/Pending";
import Approved from "./pages/Accountancy/Approved";
import AccountancyRejected from "./pages/Accountancy/Rejected";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/documents" element={<Documents />} />
            <Route path="/student/fee" element={<FeePayments />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/csab-analytics" element={<CSABAnalytics />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/verifiers" element={<Verifiers />} />
            <Route path="/admin/accountancy" element={<AdminAccountancy />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/verifier" element={<VerifierDashboard />} />
            <Route path="/verifier/verified" element={<Verified />} />
            <Route path="/verifier/rejected" element={<Rejected />} />
            <Route path="/accountancy" element={<AccountancyDashboard />} />
            <Route path="/accountancy/pending" element={<Pending />} />
            <Route path="/accountancy/approved" element={<Approved />} />
            <Route
              path="/accountancy/rejected"
              element={<AccountancyRejected />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
