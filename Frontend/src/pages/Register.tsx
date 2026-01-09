import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  BookOpen,
  FileText,
  CheckCircle,
  Upload,
  AlertCircle,
  CheckSquare,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const registrationPhases = [
  { id: 1, title: "Verification", description: "JEE Main Application Number" },
  { id: 2, title: "Checklist", description: "Document requirements" },
  { id: 3, title: "Registration", description: "Complete your profile" },
];

const steps = [
  { id: 1, title: "Account", icon: User, description: "Create your account" },
  { id: 2, title: "Personal", icon: User, description: "Personal details" },
  { id: 3, title: "Academic", icon: BookOpen, description: "Academic info" },
  {
    id: 4,
    title: "Documents",
    icon: FileText,
    description: "Upload documents",
  },
  { id: 5, title: "Review", icon: CheckCircle, description: "Final review" },
];

const states = [
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Other",
];

const categories = ["General", "OBC-NCL", "SC", "ST", "EWS"];
const boards = ["CBSE", "ICSE", "State Board", "IB", "Other"];
const branches = ["CSE", "DSAI", "ECE"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const navigate = useNavigate();
  const [registrationPhase, setRegistrationPhase] = useState(1); // 1: JEE Verification, 2: Checklist, 3: Registration
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [jeeApplicationNumber, setJeeApplicationNumber] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [checklistAcknowledged, setChecklistAcknowledged] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Account
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Personal
    fullName: "",
    fatherName: "",
    motherName: "",
    parentsContact: "",
    parentsEmail: "",
    dob: "",
    gender: "",
    category: "",
    bloodGroup: "",
    aadhar: "",
    state: "",
    branch: "",
    seatAllocated: "",
    address: "",
    // Academic
    board10: "",
    year10: "",
    percentage10: "",
    board12: "",
    stream12: "",
    year12: "",
    percentage12: "",
    jeeRank: "",
    // Documents
    photographUploaded: false,
    admissionLetterUploaded: false,
    marksheet10Uploaded: false,
    marksheet12Uploaded: false,
    jeeRankCardUploaded: false,
    casteCertificateUploaded: false,
    incomeCertificateUploaded: false,
    medicalCertificateUploaded: false,
    feePaymentReceiptsUploaded: [] as boolean[],
    antiRaggingFormUploaded: false,
    performance12FormUploaded: false,
    aadharPhotoUploaded: false,
    // Terms
    termsAccepted: false,
  });

  const updateFormData = (
    field: string,
    value: string | boolean | boolean[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Verify JEE Application Number
  const handleJeeVerification = async () => {
    if (!jeeApplicationNumber || jeeApplicationNumber.trim().length === 0) {
      setVerificationError("Please enter your JEE Main Application Number");
      return;
    }

    // Basic format validation (JEE Main format: JM followed by 12 digits)
    const jeePattern = /^JM\d{12}$/i;
    if (!jeePattern.test(jeeApplicationNumber)) {
      setVerificationError(
        "Invalid format. JEE Main Application Number should be in format: JM followed by 12 digits (e.g., JM250123456789)"
      );
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    // Simulate API call to verify JEE Application Number
    setTimeout(() => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/verify-jee-application', {
      //   method: 'POST',
      //   body: JSON.stringify({ applicationNumber: jeeApplicationNumber })
      // });

      // Dummy verification - accept all valid format JEE numbers
      const isValid = true; // In real implementation, this comes from API

      if (isValid) {
        toast.success("JEE Application Number verified successfully!");
        setRegistrationPhase(2); // Move to checklist phase
      } else {
        setVerificationError(
          "JEE Application Number not found in our database. Please check and try again."
        );
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleChecklistContinue = () => {
    if (!checklistAcknowledged) {
      toast.error("Please confirm that you have read the checklist properly");
      return;
    }
    setRegistrationPhase(3); // Move to registration phase
  };

  const handleNext = () => {
    // Validate step 4 (Documents) before proceeding
    if (currentStep === 4) {
      const requiredDocs = [
        { key: "photographUploaded", label: "Passport Size Photograph" },
        {
          key: "admissionLetterUploaded",
          label: "Provisional Admission Letter",
        },
        { key: "marksheet10Uploaded", label: "Class 10th Marksheet" },
        { key: "marksheet12Uploaded", label: "Class 12th Marksheet" },
        { key: "jeeRankCardUploaded", label: "JEE Mains Rank Card" },
        { key: "casteCertificateUploaded", label: "Caste Certificate" },
        { key: "incomeCertificateUploaded", label: "Income Certificate" },
        { key: "medicalCertificateUploaded", label: "Medical Certificate" },
        { key: "antiRaggingFormUploaded", label: "Anti-Ragging Form" },
        {
          key: "performance12FormUploaded",
          label: "Performance in Class 12th Form",
        },
        { key: "aadharPhotoUploaded", label: "Aadhar Card" },
      ];

      const missingDocs = requiredDocs.filter(
        (doc) => !formData[doc.key as keyof typeof formData]
      );

      // Check if at least one fee payment receipt is uploaded
      const feeReceipts = formData.feePaymentReceiptsUploaded as boolean[];
      const hasFeeReceipt =
        feeReceipts.length > 0 && feeReceipts.some((r) => r);

      if (missingDocs.length > 0 || !hasFeeReceipt) {
        let errorMessage = "Please upload all required documents:\n";
        if (missingDocs.length > 0) {
          errorMessage += missingDocs.map((doc) => `• ${doc.label}`).join("\n");
        }
        if (!hasFeeReceipt) {
          errorMessage += "\n• Fee Payment Receipt (at least one)";
        }
        toast.error(errorMessage);
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Application submitted successfully!");
      navigate("/student");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Full Name (as per documents) *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={(e) => updateFormData("fatherName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={(e) => updateFormData("motherName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentsContact">
                  Parent's Contact Number *
                </Label>
                <Input
                  id="parentsContact"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.parentsContact}
                  onChange={(e) =>
                    updateFormData("parentsContact", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentsEmail">Parent's Email *</Label>
                <Input
                  id="parentsEmail"
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.parentsEmail}
                  onChange={(e) =>
                    updateFormData("parentsEmail", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateFormData("dob", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => updateFormData("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => updateFormData("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Group *</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) => updateFormData("bloodGroup", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number *</Label>
                <Input
                  id="aadhar"
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhar}
                  onChange={(e) => updateFormData("aadhar", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(v) => updateFormData("state", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase()}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch Allocated *</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(v) => updateFormData("branch", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Seat Allocated Through *</Label>
                <Select
                  value={formData.seatAllocated}
                  onValueChange={(v) => updateFormData("seatAllocated", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select allocation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JoSAA">JoSAA</SelectItem>
                    <SelectItem value="CSAB">CSAB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Class 10 Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Board *</Label>
                  <Select
                    value={formData.board10}
                    onValueChange={(v) => updateFormData("board10", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board} value={board.toLowerCase()}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year10">Year of Passing *</Label>
                  <Input
                    id="year10"
                    placeholder="e.g., 2022"
                    value={formData.year10}
                    onChange={(e) => updateFormData("year10", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage10">Percentage / CGPA *</Label>
                  <Input
                    id="percentage10"
                    placeholder="e.g., 95.5%"
                    value={formData.percentage10}
                    onChange={(e) =>
                      updateFormData("percentage10", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Class 12 / Diploma Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Board *</Label>
                  <Select
                    value={formData.board12}
                    onValueChange={(v) => updateFormData("board12", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board} value={board.toLowerCase()}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stream *</Label>
                  <Select
                    value={formData.stream12}
                    onValueChange={(v) => updateFormData("stream12", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science (PCM)</SelectItem>
                      <SelectItem value="pcb">Science (PCB)</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year12">Year of Passing *</Label>
                  <Input
                    id="year12"
                    placeholder="e.g., 2024"
                    value={formData.year12}
                    onChange={(e) => updateFormData("year12", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage12">Percentage / CGPA *</Label>
                  <Input
                    id="percentage12"
                    placeholder="e.g., 92.5%"
                    value={formData.percentage12}
                    onChange={(e) =>
                      updateFormData("percentage12", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Entrance Exam Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jeeRank">JEE Main Rank (if applicable)</Label>
                  <Input
                    id="jeeRank"
                    placeholder="Enter JEE rank"
                    value={formData.jeeRank}
                    onChange={(e) => updateFormData("jeeRank", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Download Links Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Download Required Forms
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Please download, fill, and upload the following forms as
                required:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="justify-start bg-white hover:bg-blue-50 border-blue-300"
                  onClick={() => {
                    // TODO: Add actual PDF download link
                    toast.info("Medical Certificate format will be downloaded");
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Certificate Format
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-white hover:bg-blue-50 border-blue-300"
                  onClick={() => {
                    // TODO: Add actual PDF download link
                    toast.info("Anti-Ragging form will be downloaded");
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Anti-Ragging Form
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-white hover:bg-blue-50 border-blue-300"
                  onClick={() => {
                    // TODO: Add actual PDF download link
                    toast.info(
                      "Performance in Class 12th form will be downloaded"
                    );
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Performance Form (Class 12)
                </Button>
              </div>
              <p className="text-xs text-blue-700 mt-3">
                <strong>Note:</strong> Performance in Class 12th form is only
                required if marks are less than 75% for General/OBC or 65% for
                SC/ST categories.
              </p>
            </div>

            {/* Instructions */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Upload all required documents in PDF or JPG format. Maximum file
                size: 2MB per file. Ensure documents are clear and readable.
              </AlertDescription>
            </Alert>

            {/* Document Upload Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "photographUploaded",
                  label: "Passport Size Photograph",
                  required: true,
                  description: "Recent passport size photo",
                },
                {
                  key: "admissionLetterUploaded",
                  label: "Provisional Admission Letter",
                  required: true,
                  description: "Downloaded from JoSAA/CSAB",
                },
                {
                  key: "marksheet10Uploaded",
                  label: "Class 10th Marksheet/Certificate",
                  required: true,
                  description: "X class pass certificate",
                },
                {
                  key: "marksheet12Uploaded",
                  label: "Class 12th Marksheet/Certificate",
                  required: true,
                  description: "XII / Intermediate certificate",
                },
                {
                  key: "jeeRankCardUploaded",
                  label: "JEE Mains Rank Card",
                  required: true,
                  description: "JEE Main Rank Card/Admit Card",
                },
                {
                  key: "casteCertificateUploaded",
                  label: "Caste Certificate",
                  required: true,
                  description: "SC/ST/OBC-NCL/EWS/PwD certificate",
                },
                {
                  key: "incomeCertificateUploaded",
                  label: "Income Certificate",
                  required: true,
                  description: "Valid income certificate",
                },
                {
                  key: "medicalCertificateUploaded",
                  label: "Medical Certificate",
                  required: true,
                  description: "As per JoSAA/CSAB format",
                },
                {
                  key: "antiRaggingFormUploaded",
                  label: "Anti-Ragging Form",
                  required: true,
                  description: "Duly filled and signed",
                },
                {
                  key: "performance12FormUploaded",
                  label: "Performance in Class 12th Form",
                  required: true,
                  description:
                    "Required if marks < 75% (Gen/OBC) or < 65% (SC/ST)",
                },
                {
                  key: "aadharPhotoUploaded",
                  label: "Aadhar Card",
                  required: true,
                  description: "Clear copy of Aadhar card",
                },
              ].map((doc) => (
                <div
                  key={doc.key}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all ${
                    formData[doc.key as keyof typeof formData]
                      ? "border-success bg-success/5"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {formData[doc.key as keyof typeof formData] ? (
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {doc.label}{" "}
                        {doc.required && (
                          <span className="text-destructive">*</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.description}
                      </p>
                      <p
                        className={`text-xs font-medium mt-1 ${
                          formData[doc.key as keyof typeof formData]
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formData[doc.key as keyof typeof formData]
                          ? "✓ Uploaded"
                          : "Not uploaded"}
                      </p>
                      {formData[doc.key as keyof typeof formData] && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => {
                              toast.info(`Viewing ${doc.label}`);
                              // TODO: Implement actual document viewer
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => updateFormData(doc.key, false)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      {!formData[doc.key as keyof typeof formData] && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs mt-2"
                          onClick={() => updateFormData(doc.key, true)}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Fee Payment Receipts - Multiple Upload */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">
                        Fee Payment Receipts{" "}
                        <span className="text-destructive">*</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Institute + Hostel fee (SBI Collect) - Upload multiple
                        receipts if needed
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const current =
                          formData.feePaymentReceiptsUploaded as boolean[];
                        updateFormData("feePaymentReceiptsUploaded", [
                          ...current,
                          true,
                        ]);
                        toast.success("Fee receipt added");
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Receipt
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(formData.feePaymentReceiptsUploaded as boolean[])
                      .length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No receipts uploaded yet. Click "Add Receipt" to upload.
                      </p>
                    ) : (
                      (formData.feePaymentReceiptsUploaded as boolean[]).map(
                        (_, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white border border-success/20 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                <Check className="w-4 h-4 text-success" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Fee Receipt #{index + 1}
                                </p>
                                <p className="text-xs text-success">
                                  ✓ Uploaded
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  toast.info(
                                    `Viewing Fee Receipt #${index + 1}`
                                  );
                                  // TODO: Implement actual document viewer
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  const current =
                                    formData.feePaymentReceiptsUploaded as boolean[];
                                  const updated = current.filter(
                                    (_, i) => i !== index
                                  );
                                  updateFormData(
                                    "feePaymentReceiptsUploaded",
                                    updated
                                  );
                                  toast.info("Receipt removed");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-success/5 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-foreground">
                    Application Ready for Submission
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please review all your details carefully before submitting
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Account Information */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground font-medium">Email:</span>{" "}
                    <span className="text-foreground">{formData.email || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Phone:</span>{" "}
                    <span className="text-foreground">{formData.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground font-medium">Full Name:</span>{" "}
                    <span className="text-foreground">{formData.fullName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Father's Name:</span>{" "}
                    <span className="text-foreground">{formData.fatherName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Mother's Name:</span>{" "}
                    <span className="text-foreground">{formData.motherName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Parent's Contact:</span>{" "}
                    <span className="text-foreground">{formData.parentsContact || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Parent's Email:</span>{" "}
                    <span className="text-foreground">{formData.parentsEmail || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Date of Birth:</span>{" "}
                    <span className="text-foreground">{formData.dob || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Gender:</span>{" "}
                    <span className="text-foreground capitalize">{formData.gender || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Category:</span>{" "}
                    <span className="text-foreground uppercase">{formData.category || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Blood Group:</span>{" "}
                    <span className="text-foreground">{formData.bloodGroup || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Aadhar Number:</span>{" "}
                    <span className="text-foreground">{formData.aadhar || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">State:</span>{" "}
                    <span className="text-foreground capitalize">{formData.state || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Branch Allocated:</span>{" "}
                    <span className="text-foreground">{formData.branch || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Seat Allocated Through:</span>{" "}
                    <span className="text-foreground">{formData.seatAllocated || "Not provided"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground font-medium">Address:</span>{" "}
                    <span className="text-foreground">{formData.address || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Academic Details
                </h4>
                <div className="space-y-4">
                  {/* Class 10 */}
                  <div className="border-b border-border pb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Class 10th</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">Board:</span>{" "}
                        <span className="text-foreground">{formData.board10 || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Year:</span>{" "}
                        <span className="text-foreground">{formData.year10 || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Percentage:</span>{" "}
                        <span className="text-foreground">{formData.percentage10 ? `${formData.percentage10}%` : "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  {/* Class 12 */}
                  <div className="border-b border-border pb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Class 12th / Intermediate</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">Board:</span>{" "}
                        <span className="text-foreground">{formData.board12 || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Stream:</span>{" "}
                        <span className="text-foreground">{formData.stream12 || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Year:</span>{" "}
                        <span className="text-foreground">{formData.year12 || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Percentage:</span>{" "}
                        <span className="text-foreground">{formData.percentage12 ? `${formData.percentage12}%` : "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  {/* JEE */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">JEE Main</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">JEE Application Number:</span>{" "}
                        <span className="text-foreground">{jeeApplicationNumber || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">JEE Rank:</span>{" "}
                        <span className="text-foreground">{formData.jeeRank || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Uploaded */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents Uploaded
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {[
                    { key: "photographUploaded", label: "Passport Size Photograph" },
                    { key: "admissionLetterUploaded", label: "Provisional Admission Letter" },
                    { key: "marksheet10Uploaded", label: "Class 10th Marksheet" },
                    { key: "marksheet12Uploaded", label: "Class 12th Marksheet" },
                    { key: "jeeRankCardUploaded", label: "JEE Mains Rank Card" },
                    { key: "casteCertificateUploaded", label: "Caste Certificate" },
                    { key: "incomeCertificateUploaded", label: "Income Certificate" },
                    { key: "medicalCertificateUploaded", label: "Medical Certificate" },
                    { key: "antiRaggingFormUploaded", label: "Anti-Ragging Form" },
                    { key: "performance12FormUploaded", label: "Performance in Class 12th Form" },
                    { key: "aadharPhotoUploaded", label: "Aadhar Card" },
                  ].map((doc) => (
                    <div key={doc.key} className="flex items-center gap-2">
                      {formData[doc.key as keyof typeof formData] ? (
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                      <span className={formData[doc.key as keyof typeof formData] ? "text-foreground" : "text-muted-foreground"}>
                        {doc.label}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    {(formData.feePaymentReceiptsUploaded as boolean[]).length > 0 ? (
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                    <span className={(formData.feePaymentReceiptsUploaded as boolean[]).length > 0 ? "text-foreground" : "text-muted-foreground"}>
                      Fee Payment Receipts ({(formData.feePaymentReceiptsUploaded as boolean[]).length} uploaded)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  updateFormData("termsAccepted", checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-amber-900 cursor-pointer font-medium"
              >
                I hereby declare that all information provided above is true and
                correct to the best of my knowledge. I understand that providing false 
                information may result in immediate cancellation of my admission and 
                further legal action.
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary overflow-hidden flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-xl text-foreground">IDAP</h1>
              <p className="text-xs text-muted-foreground">IIIT Dharwad</p>
            </div>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Admission Application
          </h2>
          <p className="text-muted-foreground mt-2">
            {registrationPhase === 1 &&
              "Verify your JEE Main Application Number"}
            {registrationPhase === 2 && "Review document requirements"}
            {registrationPhase === 3 && "Complete your registration"}
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${
                  ((registrationPhase - 1) / (registrationPhases.length - 1)) *
                  100
                }%`,
              }}
            />

            {registrationPhases.map((phase) => (
              <div
                key={phase.id}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    registrationPhase >= phase.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {registrationPhase > phase.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{phase.id}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 hidden md:block ${
                    registrationPhase >= phase.id
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {phase.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 1: JEE Verification */}
        {registrationPhase === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-xl font-semibold text-foreground">
                JEE Main Application Verification
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your JEE Main 2025 Application Number to begin
                registration
              </p>
            </div>

            <div className="p-8">
              <div className="max-w-md mx-auto space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    Registration is permitted only for candidates who have been
                    officially allotted a seat.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="jeeAppNo" className="text-base font-semibold">
                    JEE Main Application Number *
                  </Label>
                  <Input
                    id="jeeAppNo"
                    type="text"
                    placeholder="e.g., JM250123456789"
                    value={jeeApplicationNumber}
                    onChange={(e) => {
                      setJeeApplicationNumber(e.target.value.toUpperCase());
                      setVerificationError("");
                    }}
                    className="text-lg h-12"
                    disabled={isVerifying}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: JM followed by 12 digits (as per JoSAA/CSAB website)
                  </p>

                  {verificationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{verificationError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  onClick={handleJeeVerification}
                  disabled={isVerifying || !jeeApplicationNumber}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Document Checklist */}
        {registrationPhase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-xl font-semibold text-foreground">
                Document Checklist
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please review the required documents before proceeding
              </p>
            </div>

            <div className="p-8">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Important Notice
                    </h4>
                    <p className="text-sm text-amber-800">
                      The following documents need to be uploaded in the
                      admission form and also bring the original documents
                      during physical reporting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passport size photograph</strong> identical to the
                      one uploaded during JEE (Mains) 2025 registration (carry
                      two passport size photos during reporting)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Provisional Admission Letter</strong> (downloaded
                      from JoSAA/CSAB website)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>X class Pass Certificate</strong> / X MarkSheet
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Intermediate</strong> / X + 2 Pass Certificate / X
                      + 2 MarkSheet
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>JEE Mains Rank Card</strong> / JEE Main Admit Card
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>SC/ST/OBC-NCL/PwD/EWS</strong> certificate
                      <br />
                      <span className="text-muted-foreground text-xs mt-1 block">
                        Note: OBC-NCL and EWS certificate should have been
                        issued on or after 01.04.2025 only as per the format
                        available in JoSAA website
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Medical Certificate</strong> as per the JoSAA/CSAB
                      format
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Institute fee payment receipt</strong> generated
                      by SBI Collect
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Hostel fee payment receipt</strong> generated by
                      SBI Collect
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Undertaking</strong> by the student and parents
                      regarding seat confirmation (Please fill{" "}
                      <strong>Annexure-1</strong>)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Performance in Class XII</strong> (or equivalent)
                      Examination (Please fill <strong>Annexure-2</strong>)
                      <br />
                      <span className="text-muted-foreground text-xs mt-1 block">
                        *Fill this form only if the student does not meet the
                        eligibility: 75% for GEN/OBC-NCL/GEN-EWS, or 65% for
                        SC/ST/PwD
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Aadhar Card</strong>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Checkbox
                    id="checklist-acknowledged"
                    checked={checklistAcknowledged}
                    onCheckedChange={(checked) =>
                      setChecklistAcknowledged(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="checklist-acknowledged"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    I have read and understood the document requirements listed
                    above. I confirm that I will upload the required documents
                    and bring the original documents during physical reporting.
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setRegistrationPhase(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleChecklistContinue}
                    disabled={!checklistAcknowledged}
                    className="flex-1"
                  >
                    I Acknowledge & Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Full Registration Form */}
        {registrationPhase === 3 && (
          <>
            {/* Progress Steps for Registration */}
            <div className="mb-8">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
                <div
                  className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />

                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="relative flex flex-col items-center z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden md:block ${
                        currentStep >= step.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-xl font-semibold text-foreground">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-border bg-muted/30 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 5 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={!formData.termsAccepted || isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Help Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already applied?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
