import { useState, useRef } from "react";
import AdminSidebar from "./Sidebar";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordsPerPage = 10;

  // Apply filters to student records
  const filteredRecords = allStudentRecords.filter((student) => {
    if (selectedRound !== "all" && student.round !== selectedRound)
      return false;
    if (
      selectedProgram !== "all" &&
      student.brCd.toLowerCase() !== selectedProgram
    )
      return false;
    if (
      selectedCategory !== "all" &&
      student.category.toLowerCase() !== selectedCategory
    )
      return false;
    if (
      selectedGender !== "all" &&
      student.gender.toLowerCase() !== selectedGender
    )
      return false;
    if (
      selectedState !== "all" &&
      student.state.toLowerCase() !== selectedState.toLowerCase()
    )
      return false;
    return true;
  });

  // Calculate filtered analytics
  const filteredAnalytics = {
    totalStudents: filteredRecords.length,
    genderDistribution: [
      {
        name: "Male",
        value: filteredRecords.filter((s) => s.gender === "Male").length,
      },
      {
        name: "Female",
        value: filteredRecords.filter((s) => s.gender === "Female").length,
      },
    ],
    categoryDistribution: [
      "Open",
      "Open-PwD",
      "OBC-NCL",
      "OBC-NCL-PwD",
      "SC",
      "SC-PwD",
      "ST",
      "ST-PwD",
      "EWS",
      "EWS-PwD",
    ].map((cat) => ({
      name: cat,
      value: filteredRecords.filter((s) => s.category === cat).length,
    })),
    programDistribution: ["CSE", "DSAI", "ECE"].map((prog) => {
      const progRecords = filteredRecords.filter((s) => s.brCd === prog);
      const ranks = progRecords.map((s) => s.rank).sort((a, b) => a - b);
      // Define total seats for each program
      const totalSeatsMap: { [key: string]: number } = {
        CSE: 60,
        DSAI: 50,
        ECE: 40,
      };
      return {
        name: prog,
        value: progRecords.length,
        totalSeats: totalSeatsMap[prog] || 0,
        openRank: ranks.length > 0 ? ranks[0] : 0,
        closeRank: ranks.length > 0 ? ranks[ranks.length - 1] : 0,
      };
    }),
    stateDistribution: Array.from(new Set(filteredRecords.map((s) => s.state)))
      .map((state) => ({
        name: state,
        value: filteredRecords.filter((s) => s.state === state).length,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12),
    quotaDistribution: ["AI", "HS", "OS"].map((q) => ({
      name: q,
      value: filteredRecords.filter((s) => s.quota === q).length,
    })),
    seatPoolDistribution: ["Gender-Neutral", "Female-Only", "PwD"].map(
      (sp) => ({
        name: sp,
        value: filteredRecords.filter((s) => s.seatPool === sp).length,
      })
    ),
  };

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

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
        imgHeight * ratio
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
          imgHeight * ratio
        );
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `CSAB_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "JEE App No",
      "Name",
      "Father Name",
      "Mother Name",
      "Category",
      "PwD",
      "Gender",
      "DOB",
      "State",
      "Program",
      "Rank",
      "Quota",
      "Seat Pool",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((student) =>
        [
          student.appNo,
          `"${student.name}"`,
          `"${student.fatherName}"`,
          `"${student.motherName}"`,
          student.category,
          student.pwd,
          student.gender,
          student.dob,
          student.state,
          `"${student.program}"`,
          student.rank,
          student.quota,
          student.seatPool,
          student.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CSAB_Student_Records_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      alert("Please select a CSV file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("csvFile", uploadedFile);

      // TODO: Replace with actual backend API endpoint
      // const response = await fetch('/api/admin/csab/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `CSV file "${uploadedFile.name}" uploaded successfully! Analytics will be updated with backend data.`
      );

      // Reset file input
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert("Failed to upload CSV file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6">
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
                <span>{dummyAnalyticsData.metadata.fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Uploaded:</span>
                <span>
                  {formatDate(dummyAnalyticsData.metadata.uploadDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Total Records:</span>
                <span className="font-semibold text-blue-600">
                  {dummyAnalyticsData.metadata.totalRecords}
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
                  Upload the CSAB allotment CSV to enable student admissions and
                  generate admission analytics.
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                      Admission Round
                    </label>
                    <Select
                      value={selectedRound}
                      onValueChange={setSelectedRound}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rounds</SelectItem>
                        <SelectItem value="round1">Round 1</SelectItem>
                        <SelectItem value="round2">Round 2</SelectItem>
                        <SelectItem value="round3">Round 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                        <SelectItem value="obc-ncl-pwd">OBC-NCL-PwD</SelectItem>
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
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="andhra pradesh">
                          Andhra Pradesh
                        </SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
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
                    {filteredRecords.filter((s) => s.pwd === "Yes").length}
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
                    <div className="flex flex-wrap gap-4 justify-center">
                      {filteredAnalytics.genderDistribution.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {item.value}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                              fill={COLORS.gender[index % COLORS.gender.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
                        )
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
                              ? ((item.value / item.totalSeats) * 100).toFixed(
                                  1
                                )
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
                        }
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
                            Seats
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAnalytics.programDistribution.map(
                          (prog, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium text-gray-900">
                                {prog.name}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                  {prog.openRank > 0
                                    ? prog.openRank.toLocaleString()
                                    : "-"}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  {prog.closeRank > 0
                                    ? prog.closeRank.toLocaleString()
                                    : "-"}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center font-semibold text-gray-900">
                                {prog.value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
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
                        dataKey="openRank"
                        fill="#06b6d4"
                        name="Opening Rank"
                      />
                      <Bar
                        dataKey="closeRank"
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
                      {filteredAnalytics.quotaDistribution.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {item.value}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.name}
                          </div>
                        </div>
                      ))}
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
                          )
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
                        )
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
                      <>
                        <TableRow
                          key={student.appNo}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-mono text-xs">
                            {student.appNo}
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
                            {student.brCd}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-blue-600">
                            {student.rank.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {student.state}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === student.appNo
                                    ? null
                                    : student.appNo
                                )
                              }
                              className="text-xs"
                            >
                              {expandedRow === student.appNo ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedRow === student.appNo && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={9} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="font-semibold text-gray-700 mb-1">
                                    Personal Information
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Father's Name:
                                    </span>{" "}
                                    {student.fatherName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Mother's Name:
                                    </span>{" "}
                                    {student.motherName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Date of Birth:
                                    </span>{" "}
                                    {new Date(student.dob).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">PwD:</span>{" "}
                                    {student.pwd}
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
                                    <span className="font-medium">Quota:</span>{" "}
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
                                      Seat Acceptance:
                                    </span>{" "}
                                    ₹
                                    {student.seatAcceptanceFee.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Partial Admission:
                                    </span>{" "}
                                    ₹
                                    {student.partialAdmissionFee.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Participation:
                                    </span>{" "}
                                    ₹{student.participationFee.toLocaleString()}
                                  </p>
                                </div>
                                <div className="lg:col-span-2">
                                  <p className="font-semibold text-gray-700 mb-1">
                                    Contact Information
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Mobile:</span>{" "}
                                    {student.mobile}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Email:</span>{" "}
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
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
                  {filteredRecords.length} records
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
                    )
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
      </main>
    </div>
  );
};

export default CSABAnalytics;
