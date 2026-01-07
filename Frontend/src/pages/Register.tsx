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
} from "lucide-react";
import { toast } from "sonner";

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

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
    dob: "",
    gender: "",
    category: "",
    aadhar: "",
    state: "",
    district: "",
    areaType: "",
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
    photoUploaded: false,
    signatureUploaded: false,
    marksheet10Uploaded: false,
    marksheet12Uploaded: false,
    casteCertUploaded: false,
    incomeCertUploaded: false,
    // Terms
    termsAccepted: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
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
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={(e) => updateFormData("district", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Area Type *</Label>
                <Select
                  value={formData.areaType}
                  onValueChange={(v) => updateFormData("areaType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rural / Urban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Upload all required documents in PDF or JPG format. Maximum file
              size: 2MB per file.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "photoUploaded",
                  label: "Passport Photo",
                  required: true,
                },
                {
                  key: "signatureUploaded",
                  label: "Signature",
                  required: true,
                },
                {
                  key: "marksheet10Uploaded",
                  label: "Class 10 Marksheet",
                  required: true,
                },
                {
                  key: "marksheet12Uploaded",
                  label: "Class 12 Marksheet",
                  required: true,
                },
                {
                  key: "casteCertUploaded",
                  label: "Caste Certificate",
                  required: false,
                },
                {
                  key: "incomeCertUploaded",
                  label: "Income Certificate",
                  required: false,
                },
              ].map((doc) => (
                <div
                  key={doc.key}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    formData[doc.key as keyof typeof formData]
                      ? "border-success bg-success/5"
                      : "border-border hover:border-primary"
                  }`}
                  onClick={() =>
                    updateFormData(
                      doc.key,
                      !formData[doc.key as keyof typeof formData]
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    {formData[doc.key as keyof typeof formData] ? (
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {doc.label}{" "}
                        {doc.required && (
                          <span className="text-destructive">*</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formData[doc.key as keyof typeof formData]
                          ? "Uploaded"
                          : "Click to upload"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
                    Please review your details below
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">
                  Personal Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {formData.fullName || "Not provided"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    {formData.gender || "Not provided"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    {formData.category || "Not provided"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">State:</span>{" "}
                    {formData.state || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">
                  Academic Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Class 10:</span>{" "}
                    {formData.percentage10 || "Not provided"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Class 12:</span>{" "}
                    {formData.percentage12 || "Not provided"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">JEE Rank:</span>{" "}
                    {formData.jeeRank || "Not applicable"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  updateFormData("termsAccepted", checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                I hereby declare that all information provided is true and
                correct. I understand that providing false information may
                result in cancellation of my admission.
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
              <img
                src="/logo.png"
                alt="IDAP Logo"
                className="w-full h-full object-contain"
              />
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
            Complete all steps to submit your application
          </p>
        </div>

        {/* Progress Steps */}
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
      </div>
    </div>
  );
};

export default Register;
