import StudentSidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  FileText,
  Award,
  Users,
  Loader2,
  AlertCircle,
  Edit,
  Shield,
  BadgeCheck,
  Wallet,
} from "lucide-react";
import { studentAPI } from "@/lib/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getProfile();
      setProfile(data);
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <StudentSidebar />
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load profile</p>
            <Button onClick={fetchProfile} className="mt-4">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 py-2">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground mt-0.5 text-sm">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  const ContactCard = ({ title, name, email, icon: Icon, color }: any) => (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div
            className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium">{name || "Not Assigned"}</span>
        </div>
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`mailto:${email}`}
              className="text-sm text-primary hover:underline"
            >
              {email}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border px-4 sm:px-6 py-4 pr-20 lg:pr-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              View your personal and academic information
            </p>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                {profile.personal?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.personal?.fullName}
                </h2>
                <p className="text-muted-foreground mt-1">
                  JEE Application: {profile.jeeApplicationNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {profile.personal?.branchAllocated}
                  </Badge>
                  <Badge
                    className={`${
                      profile.admissionStatus === "admitted"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }`}
                  >
                    {profile.admissionStatus
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Need Help? Contact Support Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContactCard
                title="Admin"
                name={profile.adminContact?.name}
                email={profile.adminContact?.email}
                icon={Shield}
                color="bg-blue-500"
              />
              <ContactCard
                title="Document Verifier"
                name={profile.assignedVerifier?.name}
                email={profile.assignedVerifier?.email}
                icon={BadgeCheck}
                color="bg-green-500"
              />
              <ContactCard
                title="Accountant"
                name={profile.assignedAccountant?.name}
                email={profile.assignedAccountant?.email}
                icon={Wallet}
                color="bg-purple-500"
              />
            </div>
          </motion.div>

          {/* Two Column Layout for Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow
                      icon={User}
                      label="Full Name"
                      value={profile.personal?.fullName}
                    />
                    <Separator />
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={profile.account?.email}
                    />
                    <Separator />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={profile.account?.phone}
                    />
                    <Separator />
                    <InfoRow
                      icon={Calendar}
                      label="Date of Birth"
                      value={
                        profile.personal?.dob
                          ? new Date(profile.personal.dob).toLocaleDateString()
                          : "N/A"
                      }
                    />
                    <Separator />
                    <InfoRow
                      icon={User}
                      label="Gender"
                      value={profile.personal?.gender}
                    />
                    <Separator />
                    <InfoRow
                      icon={FileText}
                      label="Category"
                      value={profile.personal?.category}
                    />
                    <Separator />
                    <InfoRow
                      icon={FileText}
                      label="Blood Group"
                      value={profile.personal?.bloodGroup}
                    />
                    <Separator />
                    <InfoRow
                      icon={FileText}
                      label="Aadhar Number"
                      value={profile.personal?.aadharNumber}
                    />
                    <Separator />
                    <InfoRow
                      icon={MapPin}
                      label="State"
                      value={profile.personal?.state}
                    />
                    <Separator />
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={profile.personal?.address}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Parent Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5" />
                      Parent/Guardian Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow
                      icon={User}
                      label="Father's Name"
                      value={profile.personal?.fatherName}
                    />
                    <Separator />
                    <InfoRow
                      icon={User}
                      label="Mother's Name"
                      value={profile.personal?.motherName}
                    />
                    <Separator />
                    <InfoRow
                      icon={Phone}
                      label="Parent Contact"
                      value={profile.personal?.parentContact}
                    />
                    <Separator />
                    <InfoRow
                      icon={Mail}
                      label="Parent Email"
                      value={profile.personal?.parentEmail}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Academic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="w-5 h-5" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        Class 10th
                      </h4>
                      <div className="space-y-1">
                        <InfoRow
                          icon={FileText}
                          label="Board"
                          value={profile.academic?.class10?.board}
                        />
                        <Separator />
                        <InfoRow
                          icon={Calendar}
                          label="Year"
                          value={profile.academic?.class10?.year}
                        />
                        <Separator />
                        <InfoRow
                          icon={Award}
                          label="Percentage"
                          value={`${profile.academic?.class10?.percentage}%`}
                        />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        Class 12th
                      </h4>
                      <div className="space-y-1">
                        <InfoRow
                          icon={FileText}
                          label="Board"
                          value={profile.academic?.class12?.board}
                        />
                        <Separator />
                        <InfoRow
                          icon={FileText}
                          label="Stream"
                          value={profile.academic?.class12?.stream}
                        />
                        <Separator />
                        <InfoRow
                          icon={Calendar}
                          label="Year"
                          value={profile.academic?.class12?.year}
                        />
                        <Separator />
                        <InfoRow
                          icon={Award}
                          label="Percentage"
                          value={`${profile.academic?.class12?.percentage}%`}
                        />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        JEE Main
                      </h4>
                      <InfoRow
                        icon={Award}
                        label="JEE Rank"
                        value={profile.academic?.jeeRank}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Admission Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="w-5 h-5" />
                      Admission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow
                      icon={FileText}
                      label="Branch Allocated"
                      value={profile.personal?.branchAllocated}
                    />
                    <Separator />
                    <InfoRow
                      icon={FileText}
                      label="Seat Allocated Through"
                      value={profile.personal?.seatAllocatedThrough}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
