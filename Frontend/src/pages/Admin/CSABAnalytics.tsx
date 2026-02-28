import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "./Sidebar";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { csabAPI } from "../../lib/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Download,
  Calendar,
  Users,
  GraduationCap,
  MapPin,
  Award,
  ChevronDown,
  ChevronUp,
  Upload,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dummy data structure based on CSAB CSV format
const dummyAnalyticsData = {
  metadata: {
    fileName: "CSAB_Allotment_Round_3_2025.csv",
    uploadDate: "2026-01-07T10:30:00Z",
    totalRecords: 120,
  },
  summary: {
    totalStudents: 120,
    programsCount: 3,
    statesCount: 18,
    categoriesCount: 5,
    pwdCount: 6,
  },
  genderDistribution: [
    { name: "Male", value: 78, percentage: 65.0 },
    { name: "Female", value: 42, percentage: 35.0 },
  ],
  categoryDistribution: [
    { name: "Open", value: 45, percentage: 37.5 },
    { name: "Open-PwD", value: 3, percentage: 2.5 },
    { name: "OBC-NCL", value: 32, percentage: 26.7 },
    { name: "OBC-NCL-PwD", value: 2, percentage: 1.7 },
    { name: "SC", value: 20, percentage: 16.7 },
    { name: "SC-PwD", value: 1, percentage: 0.8 },
    { name: "ST", value: 10, percentage: 8.3 },
    { name: "ST-PwD", value: 1, percentage: 0.8 },
    { name: "EWS", value: 5, percentage: 4.2 },
    { name: "EWS-PwD", value: 1, percentage: 0.8 },
  ],
  stateDistribution: [
    { name: "Karnataka", value: 28 },
    { name: "Maharashtra", value: 18 },
    { name: "Tamil Nadu", value: 14 },
    { name: "Andhra Pradesh", value: 12 },
    { name: "Telangana", value: 10 },
    { name: "Kerala", value: 8 },
    { name: "Uttar Pradesh", value: 7 },
    { name: "Rajasthan", value: 6 },
    { name: "Gujarat", value: 5 },
    { name: "West Bengal", value: 5 },
    { name: "Bihar", value: 4 },
    { name: "Madhya Pradesh", value: 3 },
  ],
  programDistribution: [
    { name: "CSE", value: 50, totalSeats: 60, openRank: 1250, closeRank: 3580 },
    {
      name: "DSAI",
      value: 40,
      totalSeats: 50,
      openRank: 1800,
      closeRank: 4200,
    },
    { name: "ECE", value: 30, totalSeats: 40, openRank: 3600, closeRank: 5420 },
  ],
  quotaDistribution: [
    { name: "AI", value: 75 },
    { name: "HS", value: 35 },
    { name: "OS", value: 10 },
  ],
  seatPoolDistribution: [
    { name: "Gender-Neutral", value: 92 },
    { name: "Female-Only", value: 22 },
    { name: "PwD", value: 6 },
  ],
};

// Dummy detailed student records
const allStudentRecords = [
  {
    appNo: "JM2501234567",
    name: "Rajesh Kumar Singh",
    fatherName: "Ramesh Singh",
    motherName: "Sunita Singh",
    category: "Open",
    pwd: "No",
    gender: "Male",
    dob: "2007-05-15",
    state: "Bihar",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "CSE",
    program: "Computer Science and Engineering",
    allottedCat: "Open",
    rank: 2145,
    quota: "AI",
    seatPool: "Gender-Neutral",
    status: "Seat Accepted",
    round: "round3",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9876543210",
    email: "rajesh.kumar@example.com",
    address: "123, Gandhi Nagar, Patna, Bihar - 800001",
  },
  {
    appNo: "JM2501234568",
    name: "Priya Sharma",
    fatherName: "Anil Sharma",
    motherName: "Meena Sharma",
    category: "OBC-NCL",
    pwd: "No",
    gender: "Female",
    dob: "2007-08-22",
    state: "Karnataka",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "DSAI",
    program: "Data Science and Artificial Intelligence",
    allottedCat: "OBC-NCL",
    rank: 3210,
    quota: "HS",
    seatPool: "Female-Only",
    status: "Seat Accepted",
    round: "round2",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9123456789",
    email: "priya.sharma@example.com",
    address: "456, MG Road, Bangalore, Karnataka - 560001",
  },
  {
    appNo: "JM2501234569",
    name: "Amit Patel",
    fatherName: "Vijay Patel",
    motherName: "Kiran Patel",
    category: "EWS",
    pwd: "No",
    gender: "Male",
    dob: "2007-03-10",
    state: "Gujarat",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "ECE",
    program: "Electronics and Communication Engineering",
    allottedCat: "EWS",
    rank: 4567,
    quota: "AI",
    seatPool: "Gender-Neutral",
    status: "Seat Accepted",
    round: "round3",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9898989898",
    email: "amit.patel@example.com",
    address: "789, Ashram Road, Ahmedabad, Gujarat - 380009",
  },
  {
    appNo: "JM2501234570",
    name: "Sneha Reddy",
    fatherName: "Krishna Reddy",
    motherName: "Lakshmi Reddy",
    category: "SC-PwD",
    pwd: "Yes",
    gender: "Female",
    dob: "2007-11-30",
    state: "Andhra Pradesh",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "CSE",
    program: "Computer Science and Engineering",
    allottedCat: "SC-PwD",
    rank: 5890,
    quota: "AI",
    seatPool: "PwD",
    status: "Seat Accepted",
    round: "round1",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9012345678",
    email: "sneha.reddy@example.com",
    address: "321, Banjara Hills, Hyderabad, Telangana - 500034",
  },
  {
    appNo: "JM2501234571",
    name: "Arjun Verma",
    fatherName: "Suresh Verma",
    motherName: "Anita Verma",
    category: "Open",
    pwd: "No",
    gender: "Male",
    dob: "2007-07-18",
    state: "Uttar Pradesh",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "DSAI",
    program: "Data Science and Artificial Intelligence",
    allottedCat: "Open",
    rank: 2834,
    quota: "OS",
    seatPool: "Gender-Neutral",
    status: "Seat Accepted",
    round: "round3",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9191919191",
    email: "arjun.verma@example.com",
    address: "567, Civil Lines, Lucknow, Uttar Pradesh - 226001",
  },
  {
    appNo: "JM2501234572",
    name: "Ananya Singh",
    fatherName: "Rajendra Singh",
    motherName: "Kavita Singh",
    category: "OBC-NCL",
    pwd: "No",
    gender: "Female",
    dob: "2007-09-12",
    state: "Maharashtra",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "ECE",
    program: "Electronics and Communication Engineering",
    allottedCat: "OBC-NCL",
    rank: 4123,
    quota: "HS",
    seatPool: "Female-Only",
    status: "Seat Accepted",
    round: "round2",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9876543211",
    email: "ananya.singh@example.com",
    address: "890, Pune Road, Mumbai, Maharashtra - 400001",
  },
  {
    appNo: "JM2501234573",
    name: "Vikram Choudhary",
    fatherName: "Mahesh Choudhary",
    motherName: "Rekha Choudhary",
    category: "ST",
    pwd: "No",
    gender: "Male",
    dob: "2007-04-25",
    state: "Rajasthan",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "CSE",
    program: "Computer Science and Engineering",
    allottedCat: "ST",
    rank: 6789,
    quota: "AI",
    seatPool: "Gender-Neutral",
    status: "Seat Accepted",
    round: "round1",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9898765432",
    email: "vikram.c@example.com",
    address: "234, Jodhpur Circle, Jaipur, Rajasthan - 302001",
  },
  {
    appNo: "JM2501234574",
    name: "Divya Nair",
    fatherName: "Suresh Nair",
    motherName: "Latha Nair",
    category: "Open",
    pwd: "No",
    gender: "Female",
    dob: "2007-06-14",
    state: "Kerala",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "DSAI",
    program: "Data Science and Artificial Intelligence",
    allottedCat: "Open",
    rank: 2567,
    quota: "AI",
    seatPool: "Female-Only",
    status: "Seat Accepted",
    round: "round3",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9123456780",
    email: "divya.nair@example.com",
    address: "567, Marine Drive, Kochi, Kerala - 682001",
  },
  {
    appNo: "JM2501234575",
    name: "Rahul Kumar",
    fatherName: "Dinesh Kumar",
    motherName: "Priya Kumar",
    category: "Open-PwD",
    pwd: "Yes",
    gender: "Male",
    dob: "2007-02-20",
    state: "Delhi",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "CSE",
    program: "Computer Science and Engineering",
    allottedCat: "Open-PwD",
    rank: 8234,
    quota: "AI",
    seatPool: "PwD",
    status: "Seat Accepted",
    round: "round2",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9876543212",
    email: "rahul.k@example.com",
    address: "45, Connaught Place, New Delhi - 110001",
  },
  {
    appNo: "JM2501234576",
    name: "Meena Devi",
    fatherName: "Ram Devi",
    motherName: "Sita Devi",
    category: "ST-PwD",
    pwd: "Yes",
    gender: "Female",
    dob: "2007-01-10",
    state: "Jharkhand",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "ECE",
    program: "Electronics and Communication Engineering",
    allottedCat: "ST-PwD",
    rank: 12345,
    quota: "AI",
    seatPool: "PwD",
    status: "Seat Accepted",
    round: "round1",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9123456781",
    email: "meena.devi@example.com",
    address: "78, Tribal Area, Ranchi, Jharkhand - 834001",
  },
  {
    appNo: "JM2501234577",
    name: "Aarav Singh",
    fatherName: "Bharat Singh",
    motherName: "Neha Singh",
    category: "EWS-PwD",
    pwd: "Yes",
    gender: "Male",
    dob: "2007-03-15",
    state: "Haryana",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "DSAI",
    program: "Data Science and Artificial Intelligence",
    allottedCat: "EWS-PwD",
    rank: 10234,
    quota: "HS",
    seatPool: "PwD",
    status: "Seat Accepted",
    round: "round3",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9876543213",
    email: "aarav.s@example.com",
    address: "123, Sector 14, Gurgaon, Haryana - 122001",
  },
  {
    appNo: "JM2501234578",
    name: "Lakshmi Patel",
    fatherName: "Gopal Patel",
    motherName: "Radha Patel",
    category: "OBC-NCL-PwD",
    pwd: "Yes",
    gender: "Female",
    dob: "2007-05-22",
    state: "Madhya Pradesh",
    nationality: "Indian",
    instCd: "I001",
    instNm: "IIIT Dharwad",
    brCd: "CSE",
    program: "Computer Science and Engineering",
    allottedCat: "OBC-NCL-PwD",
    rank: 9876,
    quota: "AI",
    seatPool: "PwD",
    status: "Seat Accepted",
    round: "round2",
    seatAcceptanceFee: 15000,
    partialAdmissionFee: 25000,
    participationFee: 1000,
    specialRoundFee: 0,
    mobile: "9123456782",
    email: "lakshmi.p@example.com",
    address: "56, Civil Lines, Bhopal, Madhya Pradesh - 462001",
  },
];

const COLORS = {
  primary: ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"],
  category: [
    "#059669",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
    "#a855f7",
    "#ec4899",
    "#14b8a6",
  ],
  gender: ["#2563eb", "#ec4899"],
};

const CSABAnalytics = () => {
  // Filter States
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // UI States
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // API Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [allRecords, setAllRecords] = useState<any[]>([]); // Store ALL records
  const [records, setRecords] = useState<any[]>([]); // Display records (paginated)
  const [uploadMetadata, setUploadMetadata] = useState<any>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordsPerPage = 10;

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply filters on frontend when filters change
  useEffect(() => {
    applyFilters();
  }, [
    selectedProgram,
    selectedCategory,
    selectedGender,
    selectedState,
    currentPage,
    allRecords,
  ]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch all records at once (no pagination, no filters)
      const [metricsData, distData, allRecordsData] = await Promise.all([
        csabAPI.getMetrics(),
        csabAPI.getDistributionStats(),
        csabAPI.getRecords({ page: 1, limit: 10000 }), // Get all records
      ]);

      setMetrics(metricsData);
      setDistributionData(distData);
      setAllRecords(allRecordsData.records || []);

      // Set upload metadata
      if (allRecordsData.records && allRecordsData.records.length > 0) {
        setUploadMetadata({
          uploadDate: allRecordsData.records[0].createdAt,
          totalRecords: allRecordsData.records.length,
        });
      }
    } catch (error: any) {
      console.error("Error fetching CSAB data:", error);
      toast.error(error.response?.data?.message || "Failed to load CSAB data");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (allRecords.length === 0) return;

    // Filter records based on selected filters
    let filtered = allRecords.filter((record: any) => {
      // Program filter
      if (selectedProgram !== "all") {
        if (
          !record.program?.toLowerCase().includes(selectedProgram.toLowerCase())
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (record.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== "all") {
        if (record.gender?.toLowerCase() !== selectedGender.toLowerCase()) {
          return false;
        }
      }

      // State filter
      if (selectedState !== "all") {
        if (
          record.stateOfEligibility?.toLowerCase() !==
          selectedState.toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });

    console.log(
      `Filtered ${filtered.length} records from ${allRecords.length} total`,
    );

    // Calculate pagination
    const total = filtered.length;
    const pages = Math.ceil(total / recordsPerPage);
    setTotalPages(pages);
    setTotalRecords(total);

    // Get current page records
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const pageRecords = filtered.slice(startIndex, endIndex);
    setRecords(pageRecords);

    // Recalculate distribution stats from filtered data
    calculateDistributionStats(filtered);
  };

  const calculateDistributionStats = (filtered: any[]) => {
    // Gender distribution
    const genderStats = filtered.reduce((acc: any, record: any) => {
      const gender = record.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Category distribution
    const categoryStats = filtered.reduce((acc: any, record: any) => {
      const category = record.category || "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // State distribution
    const stateStats = filtered.reduce((acc: any, record: any) => {
      const state = record.stateOfEligibility || "Unknown";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    // Program distribution
    const programStats = filtered.reduce((acc: any, record: any) => {
      const program = record.program || "Unknown";
      acc[program] = (acc[program] || 0) + 1;
      return acc;
    }, {});

    // Quota distribution
    const quotaStats = filtered.reduce((acc: any, record: any) => {
      const quota = record.quota || "Unknown";
      acc[quota] = (acc[quota] || 0) + 1;
      return acc;
    }, {});

    // Seat pool distribution
    const seatPoolStats = filtered.reduce((acc: any, record: any) => {
      const seatPool = record.seatPool || "Unknown";
      acc[seatPool] = (acc[seatPool] || 0) + 1;
      return acc;
    }, {});

    // Opening/Closing ranks by program
    const programRanks: any = {};
    filtered.forEach((record: any) => {
      const program = record.program || "Unknown";
      if (!programRanks[program]) {
        programRanks[program] = {
          ranks: [],
          count: 0,
        };
      }
      if (record.rank) {
        programRanks[program].ranks.push(record.rank);
      }
      programRanks[program].count++;
    });

    const openingClosingRanks = Object.keys(programRanks).map((program) => {
      const ranks = programRanks[program].ranks.sort(
        (a: number, b: number) => a - b,
      );
      return {
        _id: program,
        openingRank: ranks.length > 0 ? ranks[0] : 0,
        closingRank: ranks.length > 0 ? ranks[ranks.length - 1] : 0,
        totalAllotted: programRanks[program].count,
        totalSeats: getSeatsByProgram(program),
      };
    });

    // Update distribution data
    setDistributionData({
      genderStats: Object.keys(genderStats).map((key) => ({
        _id: key,
        count: genderStats[key],
      })),
      categoryStats: Object.keys(categoryStats).map((key) => ({
        _id: key,
        count: categoryStats[key],
      })),
      stateStats: Object.keys(stateStats).map((key) => ({
        _id: key,
        count: stateStats[key],
      })),
      programStats: Object.keys(programStats).map((key) => ({
        _id: key,
        count: programStats[key],
        totalSeats: getSeatsByProgram(key),
      })),
      quotaStats: Object.keys(quotaStats).map((key) => ({
        _id: key,
        count: quotaStats[key],
      })),
      seatPoolStats: Object.keys(seatPoolStats).map((key) => ({
        _id: key,
        count: seatPoolStats[key],
      })),
      openingClosingRanks,
    });
  };

  const getSeatsByProgram = (program: string): number => {
    const programLower = program?.toLowerCase() || "";
    if (programLower.includes("computer") || programLower.includes("cse")) {
      return 200;
    } else if (
      programLower.includes("data science") ||
      programLower.includes("dsai")
    ) {
      return 100;
    } else if (
      programLower.includes("electronics") ||
      programLower.includes("ece")
    ) {
      return 100;
    }
    return 0;
  };

  const getFilterParams = () => {
    const params: any = {};

    if (selectedRound !== "all") {
      // Map round1, round2, round3 to "Round 1", "Round 2", "Round 3"
      const roundMatch = selectedRound.match(/round(\d+)/i);
      if (roundMatch) {
        params.round = `Round ${roundMatch[1]}`;
      } else {
        params.round = selectedRound;
      }
    }
    if (selectedProgram !== "all") {
      // Map frontend values to backend database values
      const programMap: any = {
        cse: "Computer Science and Engineering",
        dsai: "Data Science and Artificial Intelligence",
        ece: "Electronics and Communication Engineering",
      };
      params.program = programMap[selectedProgram] || selectedProgram;
    }
    if (selectedCategory !== "all") {
      // Map to proper case
      params.category = selectedCategory
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-");
    }
    if (selectedGender !== "all") {
      // Capitalize first letter
      params.gender =
        selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1);
    }
    if (selectedState !== "all") {
      // Capitalize first letter of each word
      params.state = selectedState
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return params;
  };

  // Calculate total students from filtered distribution data
  const calculateTotalStudents = () => {
    if (!distributionData) return 0;

    // Sum up all program counts for accurate total
    const programTotal = (distributionData.programStats || []).reduce(
      (sum: number, item: any) => sum + (item.count || 0),
      0,
    );

    return programTotal || totalRecords || 0;
  };

  // Transform API data for charts
  const filteredAnalytics = distributionData
    ? {
        totalStudents: calculateTotalStudents(),
        genderDistribution: (distributionData.genderStats || []).map(
          (item: any) => ({
            name: item._id,
            value: item.count,
          }),
        ),
        categoryDistribution: (distributionData.categoryStats || []).map(
          (item: any) => ({
            name: item._id,
            value: item.count,
          }),
        ),
        programDistribution: (distributionData.programStats || []).map(
          (item: any) => ({
            name: item._id,
            value: item.count,
            totalSeats: item.totalSeats || 0,
            openRank: 0,
            closeRank: 0,
          }),
        ),
        stateDistribution: (distributionData.stateStats || [])
          .map((item: any) => ({
            name: item._id,
            value: item.count,
          }))
          .slice(0, 12),
        quotaDistribution: (distributionData.quotaStats || []).map(
          (item: any) => ({
            name: item._id,
            value: item.count,
          }),
        ),
        seatPoolDistribution: (distributionData.seatPoolStats || []).map(
          (item: any) => ({
            name: item._id,
            value: item.count,
          }),
        ),
        openingClosingRanks: distributionData.openingClosingRanks || [],
      }
    : {
        totalStudents: 0,
        genderDistribution: [],
        categoryDistribution: [],
        programDistribution: [],
        stateDistribution: [],
        quotaDistribution: [],
        seatPoolDistribution: [],
        openingClosingRanks: [],
      };

  // Current records are from API
  const currentRecords = records;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      // Temporarily expand the content for capture
      const element = contentRef.current;

      // Wait for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      let heightLeft = imgHeight * ratio;
      let position = 0;

      // Add pages if content is longer than one page
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        position,
        imgWidth * ratio,
        imgHeight * ratio,
      );
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          position,
          imgWidth * ratio,
          imgHeight * ratio,
        );
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `CSAB_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = getFilterParams();

      const blob = await csabAPI.exportCsv(params);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CSAB_Student_Records_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      toast.error(error.response?.data?.message || "Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a valid CSV file");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleCSVUpload = async () => {
    if (!uploadedFile) {
      toast.error("Please select a CSV file first");
      return;
    }

    setIsUploading(true);
    try {
      const result = await csabAPI.uploadCsabData(uploadedFile);

      toast.success(
        `CSV file uploaded successfully! ${result.recordsProcessed} records processed.`,
      );

      // Refresh all data after upload
      await fetchAllData();

      // Reset file input
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      toast.error(error.response?.data?.message || "Failed to upload CSV file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading CSAB Analytics...</p>
            </div>
          </div>
        ) : (
          <div ref={contentRef}>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 border-b border-gray-200 pb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                CSAB Allotment Analytics & Reports
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">File:</span>
                  <span>{uploadMetadata?.fileName || "No data uploaded"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Uploaded:</span>
                  <span>
                    {uploadMetadata?.uploadDate
                      ? formatDate(uploadMetadata.uploadDate)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Total Records:</span>
                  <span className="font-semibold text-blue-600">
                    {metrics?.totalAllotted || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CSV Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Upload CSAB Allotment Data
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Upload the CSAB allotment CSV to enable student admissions
                    and generate admission analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Select CSV File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadedFile && (
                        <p className="mt-1 text-xs text-gray-600">
                          Selected: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleCSVUpload}
                      disabled={!uploadedFile || isUploading}
                      className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload & Analyze"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Data Filters
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Refine analytics by applying filters below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Program
                      </label>
                      <Select
                        value={selectedProgram}
                        onValueChange={setSelectedProgram}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Programs</SelectItem>
                          <SelectItem value="cse">CSE</SelectItem>
                          <SelectItem value="dsai">DSAI</SelectItem>
                          <SelectItem value="ece">ECE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="open-pwd">Open-PwD</SelectItem>
                          <SelectItem value="obc-ncl">OBC-NCL</SelectItem>
                          <SelectItem value="obc-ncl-pwd">
                            OBC-NCL-PwD
                          </SelectItem>
                          <SelectItem value="sc">SC</SelectItem>
                          <SelectItem value="sc-pwd">SC-PwD</SelectItem>
                          <SelectItem value="st">ST</SelectItem>
                          <SelectItem value="st-pwd">ST-PwD</SelectItem>
                          <SelectItem value="ews">EWS</SelectItem>
                          <SelectItem value="ews-pwd">EWS-PwD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Gender
                      </label>
                      <Select
                        value={selectedGender}
                        onValueChange={setSelectedGender}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Genders</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        State of Eligibility
                      </label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {/* States (29) */}
                          <SelectItem value="andhra pradesh">
                            Andhra Pradesh
                          </SelectItem>
                          <SelectItem value="arunachal pradesh">
                            Arunachal Pradesh
                          </SelectItem>
                          <SelectItem value="assam">Assam</SelectItem>
                          <SelectItem value="bihar">Bihar</SelectItem>
                          <SelectItem value="chhattisgarh">
                            Chhattisgarh
                          </SelectItem>
                          <SelectItem value="goa">Goa</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                          <SelectItem value="himachal pradesh">
                            Himachal Pradesh
                          </SelectItem>
                          <SelectItem value="jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="madhya pradesh">
                            Madhya Pradesh
                          </SelectItem>
                          <SelectItem value="maharashtra">
                            Maharashtra
                          </SelectItem>
                          <SelectItem value="manipur">Manipur</SelectItem>
                          <SelectItem value="meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="mizoram">Mizoram</SelectItem>
                          <SelectItem value="nagaland">Nagaland</SelectItem>
                          <SelectItem value="odisha">Odisha</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="sikkim">Sikkim</SelectItem>
                          <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tripura">Tripura</SelectItem>
                          <SelectItem value="uttar pradesh">
                            Uttar Pradesh
                          </SelectItem>
                          <SelectItem value="uttarakhand">
                            Uttarakhand
                          </SelectItem>
                          <SelectItem value="west bengal">
                            West Bengal
                          </SelectItem>
                          {/* Union Territories (8) */}
                          <SelectItem value="andaman and nicobar islands">
                            Andaman and Nicobar Islands
                          </SelectItem>
                          <SelectItem value="chandigarh">Chandigarh</SelectItem>
                          <SelectItem value="dadra and nagar haveli and daman and diu">
                            Dadra and Nagar Haveli and Daman and Diu
                          </SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="jammu and kashmir">
                            Jammu and Kashmir
                          </SelectItem>
                          <SelectItem value="ladakh">Ladakh</SelectItem>
                          <SelectItem value="lakshadweep">
                            Lakshadweep
                          </SelectItem>
                          <SelectItem value="puducherry">Puducherry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Metrics Overview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                      Total Allotted
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {filteredAnalytics.totalStudents}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Students admitted</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-l-4 border-l-green-600">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                      Programs
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {filteredAnalytics.programDistribution.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Available branches</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-l-4 border-l-purple-600">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                      States
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {filteredAnalytics.stateDistribution.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Represented regions</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-l-4 border-l-orange-600">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                      Categories
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {filteredAnalytics.categoryDistribution.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Reservation types</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-l-4 border-l-red-600">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs font-medium text-gray-500 uppercase">
                      PwD Candidates
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {metrics?.pwdCandidates || 0}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Differently-abled</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Core Analytics - Charts Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {/* Gender Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Gender Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of admitted students by gender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {filteredAnalytics.genderDistribution.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                          {filteredAnalytics.genderDistribution.map(
                            (item, idx) => (
                              <div key={idx} className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  {item.value}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {item.name}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No data available for current filters
                        </div>
                      )}
                    </div>
                    {filteredAnalytics.genderDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={filteredAnalytics.genderDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {filteredAnalytics.genderDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    COLORS.gender[index % COLORS.gender.length]
                                  }
                                />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                        <p className="text-gray-400">No data to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Category Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Category-wise Distribution
                    </CardTitle>
                    <CardDescription>
                      All reservation categories including PwD variants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {filteredAnalytics.categoryDistribution.map(
                          (item, idx) => (
                            <div key={idx}>
                              <div className="text-lg font-bold text-gray-900">
                                {item.value}
                              </div>
                              <div className="text-xs text-gray-600">
                                {item.name}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={filteredAnalytics.categoryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" name="Students" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* State Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      State-wise Applicant Distribution
                    </CardTitle>
                    <CardDescription>
                      Geographic distribution of admitted candidates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 text-center">
                        {filteredAnalytics.stateDistribution
                          .slice(0, 8)
                          .map((item, idx) => (
                            <div key={idx}>
                              <div className="text-lg font-bold text-gray-900">
                                {item.value}
                              </div>
                              <div className="text-xs text-gray-600">
                                {item.name}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={filteredAnalytics.stateDistribution}
                        layout="vertical"
                        margin={{ left: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#10b981" name="Students" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Program Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Program-wise Seat Allotment
                    </CardTitle>
                    <CardDescription>
                      Seats filled across different programs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredAnalytics.programDistribution.map(
                          (item, idx) => {
                            const percentage =
                              item.totalSeats > 0
                                ? (
                                    (item.value / item.totalSeats) *
                                    100
                                  ).toFixed(1)
                                : 0;
                            return (
                              <div
                                key={idx}
                                className="border border-gray-300 rounded-lg p-3 bg-white"
                              >
                                <div className="text-center mb-2">
                                  <div className="text-lg font-bold text-purple-600">
                                    {item.name}
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Total Seats:
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {item.totalSeats}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Allotted:
                                    </span>
                                    <span className="font-semibold text-green-600">
                                      {item.value}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Remaining:
                                    </span>
                                    <span className="font-semibold text-amber-600">
                                      {item.totalSeats - item.value}
                                    </span>
                                  </div>
                                  <div className="pt-2 mt-2 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">
                                        Allotment %:
                                      </span>
                                      <span className="text-lg font-bold text-blue-600">
                                        {percentage}%
                                      </span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={filteredAnalytics.programDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="value"
                          fill="#8b5cf6"
                          name="Seats Allotted"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Opening vs Closing Ranks */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Opening vs Closing Ranks
                    </CardTitle>
                    <CardDescription>
                      Rank range comparison by program
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Rank Table */}
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                              Program
                            </th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-700 border-b">
                              Opening Rank
                            </th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-700 border-b">
                              Closing Rank
                            </th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-700 border-b">
                              Allotted
                            </th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-700 border-b">
                              Total Seats
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(filteredAnalytics.openingClosingRanks || []).map(
                            (prog, idx) => (
                              <tr
                                key={idx}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 font-medium text-gray-900">
                                  {prog._id}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                    {prog.openingRank > 0
                                      ? prog.openingRank.toLocaleString()
                                      : "-"}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    {prog.closingRank > 0
                                      ? prog.closingRank.toLocaleString()
                                      : "-"}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center font-semibold text-blue-600">
                                  {prog.totalAllotted}
                                </td>
                                <td className="px-4 py-2 text-center font-semibold text-gray-900">
                                  {prog.totalSeats || "-"}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={filteredAnalytics.openingClosingRanks || []}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="openingRank"
                          fill="#06b6d4"
                          name="Opening Rank"
                        />
                        <Bar
                          dataKey="closingRank"
                          fill="#f59e0b"
                          name="Closing Rank"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quota Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Quota Distribution
                    </CardTitle>
                    <CardDescription>
                      All India (AI), Home State (HS), Other State (OS)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap gap-6 justify-center">
                        {filteredAnalytics.quotaDistribution.map(
                          (item, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {item.value}
                              </div>
                              <div className="text-xs text-gray-600">
                                {item.name}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={filteredAnalytics.quotaDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {filteredAnalytics.quotaDistribution.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  COLORS.primary[index % COLORS.primary.length]
                                }
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Seat Pool Distribution */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Seat Pool Distribution
                    </CardTitle>
                    <CardDescription>
                      Gender-Neutral, Female-Only, and PwD seats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Text Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap gap-6 justify-center">
                        {filteredAnalytics.seatPoolDistribution.map(
                          (item, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {item.value}
                              </div>
                              <div className="text-xs text-gray-600">
                                {item.name}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={filteredAnalytics.seatPoolDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#ec4899" name="Seats" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Detailed Student Records Table */}
            <Card className="mb-8">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Detailed Student Records
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      Complete allotment data with candidate information
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      className="text-xs"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPDF}
                      className="text-xs"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-xs">
                          JEE App No
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Gender
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Category
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Program
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Rank
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          State
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRecords.map((student) => (
                        <React.Fragment key={student.jeeApplicationNumber}>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell className="font-mono text-xs">
                              {student.jeeApplicationNumber}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {student.gender}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {student.category}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {student.program}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-blue-600">
                              {student.rank.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {student.stateOfEligibility}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {student.isRegistered
                                  ? "Registered"
                                  : "Allotted"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setExpandedRow(
                                    expandedRow === student.jeeApplicationNumber
                                      ? null
                                      : student.jeeApplicationNumber,
                                  )
                                }
                                className="text-xs"
                              >
                                {expandedRow ===
                                student.jeeApplicationNumber ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedRow === student.jeeApplicationNumber && (
                            <TableRow className="bg-gray-50">
                              <TableCell colSpan={9} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="font-semibold text-gray-700 mb-1">
                                      Personal Information
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        JEE Application Number:
                                      </span>{" "}
                                      {student.jeeApplicationNumber}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Father's Name:
                                      </span>{" "}
                                      {student.fatherName || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Mother's Name:
                                      </span>{" "}
                                      {student.motherName || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Date of Birth:
                                      </span>{" "}
                                      {student.dob
                                        ? new Date(
                                            student.dob,
                                          ).toLocaleDateString("en-IN")
                                        : "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">PwD:</span>{" "}
                                      {student.pwd || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Nationality:
                                      </span>{" "}
                                      {student.nationality || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Round:
                                      </span>{" "}
                                      {student.round || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-700 mb-1">
                                      Allotment Details
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Full Program:
                                      </span>{" "}
                                      {student.program}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Quota:
                                      </span>{" "}
                                      {student.quota}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Seat Pool:
                                      </span>{" "}
                                      {student.seatPool}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Allotted Category:
                                      </span>{" "}
                                      {student.allottedCat}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-700 mb-1">
                                      Fee Details
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        JoSAA Seat Acceptance:
                                      </span>{" "}
                                      ₹
                                      {student.josaaSeatAcceptanceFee?.toLocaleString() ||
                                        "0"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Partial Admission:
                                      </span>{" "}
                                      ₹
                                      {student.partialAdmissionFee?.toLocaleString() ||
                                        "0"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Participation:
                                      </span>{" "}
                                      ₹
                                      {student.participationFee?.toLocaleString() ||
                                        "0"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Special Round:
                                      </span>{" "}
                                      ₹
                                      {student.specialRoundFee?.toLocaleString() ||
                                        "0"}
                                    </p>
                                  </div>
                                  <div className="lg:col-span-2">
                                    <p className="font-semibold text-gray-700 mb-1">
                                      Contact Information
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Mobile:
                                      </span>{" "}
                                      {student.mobile}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {student.email}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Address:
                                      </span>{" "}
                                      {student.address}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                    {Math.min(currentPage * recordsPerPage, totalRecords)} of{" "}
                    {totalRecords} records
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-xs"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="text-xs"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-xs"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports & Export Actions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Reports & Data Export
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Download comprehensive analytics reports for institutional
                  records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="default"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isExporting
                      ? "Generating PDF..."
                      : "Download Analytics Report (PDF)"}
                  </Button>
                  <Button variant="outline" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Aggregated Data (CSV)
                  </Button>
                  <Button variant="outline">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Generate Summary for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CSABAnalytics;
