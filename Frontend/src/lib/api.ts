import axios from "axios";

// API base URL - uses proxy in development, will use env variable in production
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: enables sending cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using the refresh token cookie
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }, // Send refresh token cookie
        );

        const { accessToken } = refreshResponse.data;

        // Store new access token
        localStorage.setItem("accessToken", accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear token and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");

        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// ============ Auth API Functions ============

export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, role, name } = response.data;

    // Store access token and user info
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);

    return { accessToken, role, name };
  },

  /**
   * Logout user - clears token and calls backend to clear refresh token cookie
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
    }
  },

  /**
   * Manually refresh access token
   */
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Get current user role
   */
  getUserRole: () => {
    return localStorage.getItem("userRole");
  },

  /**
   * Get current user name
   */
  getUserName: () => {
    return localStorage.getItem("userName");
  },
};

// ============ Student API Functions ============
export const studentAPI = {
  // Get student's own profile
  getProfile: async () => {
    const response = await api.get("/student/me");
    return response.data;
  },

  // Update student profile
  updateProfile: async (data: any) => {
    const response = await api.put("/student/profile", data);
    return response.data;
  },

  // Get document verification progress
  getDocumentProgress: async () => {
    const response = await api.get("/student/documents/progress");
    return response.data; // { total, verified, rejected, pending, progress }
  },

  // Re-upload a rejected document
  reuploadDocument: async (docType: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put(
      `/student/documents/reupload/${docType}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Re-upload a rejected fee receipt
  reuploadFeeReceipt: async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put(
      `/student/documents/reupload-receipt/${index}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Upload payment with receipt
  uploadPayment: async (amount: number, receiptFile: File) => {
    const formData = new FormData();
    formData.append("amount", amount.toString());
    formData.append("receipt", receiptFile);
    const response = await api.post("/student/payments/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// ============ Admin API Functions ============
export const adminAPI = {
  /**
   * Get admin dashboard statistics
   * Returns: summary stats, categoryStats, stateStats, paymentStats, genderStats, recentApplications
   */
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  /**
   * Get recent applications with pagination and filters
   */
  getRecentApplications: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/recent", { params });
    return response.data; // { totalRecords, currentPage, totalPages, applications }
  },

  /**
   * Get students by status with pagination and filters
   */
  getStudentsByStatus: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/students", { params });
    return response.data; // { totalRecords, currentPage, totalPages, students }
  },

  /**
   * Create staff member (verifier or accountancy)
   */
  createStaff: async (data: {
    name: string;
    email: string;
    password: string;
    role: "verifier" | "accountancy";
  }) => {
    const response = await api.post("/admin/create-staff", data);
    return response.data; // { message }
  },

  /**
   * Get student details by ID
   */
  getStudentDetails: async (id: string) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data; // Full student object
  },

  /**
   * Get all verifiers
   */
  getAllVerifiers: async () => {
    const response = await api.get("/admin/verifiers");
    return response.data; // { verifiers: [...] }
  },

  /**
   * Get all accountancy staff
   */
  getAllAccountancy: async () => {
    const response = await api.get("/admin/accountancy");
    return response.data; // { accountancy: [...] }
  },

  /**
   * Get students assigned to a verifier
   */
  getVerifierStudents: async (verifierId: string) => {
    const response = await api.get(`/admin/verifiers/${verifierId}/students`);
    return response.data; // Array of students
  },

  /**
   * Get students assigned to accountancy staff
   */
  getAccountancyStudents: async (accountancyId: string) => {
    const response = await api.get(
      `/admin/accountancy/${accountancyId}/students`,
    );
    return response.data; // Array of students
  },

  /**
   * Toggle staff status (activate/deactivate)
   */
  toggleStaffStatus: async (staffId: string, isActive: boolean) => {
    const response = await api.patch(`/admin/staff/${staffId}/toggle-status`, {
      isActive,
    });
    return response.data;
  },
};

// ============ Registration API Functions ============
export const registrationAPI = {
  /**
   * Verify JEE eligibility
   */
  verifyEligibility: async (jeeApplicationNumber: string) => {
    const response = await api.post("/student/verify-eligibility", {
      jeeApplicationNumber,
    });
    return response.data; // { eligible: true, data: { name, program, category, state } }
  },

  /**
   * Register student
   */
  registerStudent: async (data: {
    jeeApplicationNumber: string;
    account: {
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
    };
    personal: {
      fullName: string;
      fatherName: string;
      motherName: string;
      parentsContact: string;
      parentsEmail: string;
      dob: string;
      gender: string;
      category: string;
      bloodGroup: string;
      aadhar: string;
      state: string;
      branch: string;
      seatAllocated: string;
    };
    academic: {
      class10Board: string;
      class10Percentage: string;
      class10YearOfPassing: string;
      class12Board: string;
      class12Percentage: string;
      class12YearOfPassing: string;
      jeeRank: string;
      jeeScore: string;
    };
    termsAccepted: boolean;
  }) => {
    const response = await api.post("/student/register", data);
    return response.data; // { message, studentId }
  },

  /**
   * Upload documents
   */
  uploadDocuments: async (formData: FormData) => {
    const response = await api.post("/student/upload-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { message }
  },
};

// ============ Verifier API Functions ============
export const verifierAPI = {
  /**
   * Get pending students assigned to current verifier
   */
  getMyPendingStudents: async () => {
    const response = await api.get("/verifier/my-pending");
    return response.data; // Array of students
  },

  /**
   * Get verified students assigned to current verifier
   */
  getMyVerifiedStudents: async () => {
    const response = await api.get("/verifier/my-verified");
    return response.data; // Array of students
  },

  /**
   * Get rejected students assigned to current verifier
   */
  getMyRejectedStudents: async () => {
    const response = await api.get("/verifier/my-rejected");
    return response.data; // Array of students
  },

  /**
   * Get rejected students (not reuploaded) - for Rejected tab
   */
  getRejectedNotReuploadedStudents: async () => {
    const response = await api.get("/verifier/my-rejected-pending");
    return response.data; // Array of students
  },

  /**
   * Get rejected students (reuploaded) - for Reupload tab
   */
  getRejectedReuploadedStudents: async () => {
    const response = await api.get("/verifier/my-rejected-reuploaded");
    return response.data; // Array of students
  },

  /**
   * Get detailed student information
   */
  getAssignedStudentDetails: async (id: string) => {
    const response = await api.get(`/verifier/student/${id}`);
    return response.data; // Full student object
  },

  /**
   * Verify a document
   */
  verifyDocument: async (studentId: string, docType: string) => {
    const response = await api.put(
      `/verifier/documents/verify/${studentId}/${docType}`,
    );
    return response.data; // { message }
  },

  /**
   * Reject a document with remark
   */
  rejectDocument: async (
    studentId: string,
    docType: string,
    remark: string,
  ) => {
    const response = await api.put(
      `/verifier/documents/reject/${studentId}/${docType}`,
      {
        remark,
      },
    );
    return response.data; // { message }
  },

  /**
   * Verify a receipt
   */
  verifyReceipt: async (studentId: string, index: number) => {
    const response = await api.put(
      `/verifier/receipts/verify/${studentId}/${index}`,
    );
    return response.data; // { message }
  },

  /**
   * Reject a receipt with remark
   */
  rejectReceipt: async (studentId: string, index: number, remark: string) => {
    const response = await api.put(
      `/verifier/receipts/reject/${studentId}/${index}`,
      {
        remark,
      },
    );
    return response.data; // { message }
  },
};

// ============ Accountancy API Functions ============
export const accountancyAPI = {
  /**
   * Get payment pending students assigned to current accountant
   */
  getMyPaymentStudents: async () => {
    const response = await api.get("/accountancy/my-payments");
    return response.data; // Array of students
  },

  /**
   * Get students with rejected payments
   */
  getMyRejectedPaymentStudents: async () => {
    const response = await api.get("/accountancy/my-rejected-payments");
    return response.data; // Array of students
  },

  /**
   * Get fully admitted students (completed payments)
   */
  getMyAdmittedStudents: async () => {
    const response = await api.get("/accountancy/my-admitted");
    return response.data; // Array of students
  },

  /**
   * Get detailed payment information for a student
   */
  getPaymentDetails: async (id: string) => {
    const response = await api.get(`/accountancy/student/${id}`);
    return response.data; // Full student object with payment details
  },

  /**
   * Approve a payment
   */
  approvePayment: async (studentId: string, paymentId: string) => {
    const response = await api.put(
      `/accountancy/approve/${studentId}/${paymentId}`,
    );
    return response.data; // { message }
  },

  /**
   * Reject a payment with remark
   */
  rejectPayment: async (
    studentId: string,
    paymentId: string,
    remark?: string,
  ) => {
    const response = await api.put(
      `/accountancy/reject/${studentId}/${paymentId}`,
      {
        remark,
      },
    );
    return response.data; // { message }
  },
};

// ============ CSAB API Functions ============
export const csabAPI = {
  /**
   * Upload CSAB allotment CSV file
   */
  uploadCsabData: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/admin/csab/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { message, totalRecords }
  },

  /**
   * Check if CSAB registration is enabled (public endpoint)
   */
  getRegistrationStatus: async () => {
    const response = await api.get("/csab/registration-status");
    return response.data; // { enabled }
  },

  /**
   * Check if CSAB registration is enabled (admin endpoint - same as public)
   */
  getAdminRegistrationStatus: async () => {
    const response = await api.get("/admin/csab/registration-status");
    return response.data; // { enabled }
  },

  /**
   * Get CSAB metrics summary
   */
  getMetrics: async () => {
    const response = await api.get("/admin/csab/metrics");
    return response.data; // { totalAllotted, programs, states, categories, pwdCandidates }
  },

  /**
   * Get distribution statistics for all charts
   */
  getDistributionStats: async (filters?: {
    program?: string;
    category?: string;
    gender?: string;
    state?: string;
    round?: string;
  }) => {
    const response = await api.get("/admin/csab/distribution", {
      params: filters,
    });
    return response.data; // { genderStats, categoryStats, stateStats, programStats, quotaStats, seatPoolStats, openingClosingRanks }
  },

  /**
   * Get detailed CSAB records with pagination and filters
   */
  getRecords: async (params: {
    program?: string;
    category?: string;
    gender?: string;
    state?: string;
    round?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/csab/records", { params });
    return response.data; // { totalRecords, currentPage, totalPages, records }
  },

  /**
   * Export CSAB data as CSV with optional filters
   */
  exportCsv: async (params: {
    program?: string;
    category?: string;
    gender?: string;
    state?: string;
  }) => {
    const response = await api.get("/admin/csab/export-csv", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
