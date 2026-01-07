import { motion } from "framer-motion";
import {
  FileCheck,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  UserPlus,
  Upload,
  Eye,
  Wallet,
  Bell,
  Download,
  ArrowRight,
} from "lucide-react";

const studentFlow = [
  {
    step: "01",
    icon: UserPlus,
    title: "Register & Login",
    description:
      "Create your account with email verification. Quick and secure registration process to get started.",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  {
    step: "02",
    icon: FileText,
    title: "Fill Application Form",
    description:
      "Complete your application in easy steps. Auto-save feature ensures you never lose your progress.",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    gradient: "from-purple-500/20 to-purple-600/20",
  },
  {
    step: "03",
    icon: Upload,
    title: "Upload Documents",
    description:
      "Submit your academic certificates, ID proof, and photographs. All documents securely encrypted.",
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    gradient: "from-indigo-500/20 to-indigo-600/20",
  },
  {
    step: "04",
    icon: Eye,
    title: "Verification Process",
    description:
      "Professional verifiers review your documents. Track real-time status updates on your dashboard.",
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    gradient: "from-cyan-500/20 to-cyan-600/20",
  },
  {
    step: "05",
    icon: Wallet,
    title: "Fee Payment",
    description:
      "Complete fee payment after document approval. Multiple payment options with instant receipt generation.",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    gradient: "from-green-500/20 to-green-600/20",
  },
  {
    step: "06",
    icon: CheckCircle2,
    title: "Final Confirmation",
    description:
      "Receive admission confirmation and enrollment details. Download your admission letter instantly.",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    gradient: "from-emerald-500/20 to-emerald-600/20",
  },
];

const additionalFeatures = [
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description:
      "Instant alerts for every status change, verification update, and payment confirmation.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Shield,
    title: "Secure & Encrypted",
    description:
      "Bank-grade security with end-to-end encryption protecting all your personal information.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Download,
    title: "Download Documents",
    description:
      "Access and download your receipts, certificates, and admission letter anytime, anywhere.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description:
      "Track your application status round the clock from any device with internet access.",
    color: "bg-pink-500/10 text-pink-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* IIIT Logo with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
          className="flex justify-center mb-12"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(var(--accent-rgb, 99, 102, 241), 0.3)",
                  "0 0 40px rgba(var(--accent-rgb, 99, 102, 241), 0.5)",
                  "0 0 20px rgba(var(--accent-rgb, 99, 102, 241), 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-2"
            >
              <img
                src="/IIITLOGONAME.jpeg"
                alt="IIIT Dharwad Logo"
                className="w-72 h-32 sm:w-96 sm:h-40 md:w-[32rem] md:h-48 lg:w-[40rem] lg:h-56 object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Journey to IIIT Dharwad
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A simple, transparent, and secure admission process designed to make
            your enrollment journey smooth and hassle-free.
          </p>
        </motion.div>

        {/* Student Flow Timeline */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Connecting Lines - Hidden on mobile */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

            {studentFlow.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${
                    step.gradient
                  } backdrop-blur-sm border ${
                    step.color.split(" ")[2]
                  } group cursor-pointer h-full`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-background border-2 border-current flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl ${
                      step.color.split(" ")[0]
                    } ${
                      step.color.split(" ")[1]
                    } flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {step.description}
                  </p>

                  {/* Arrow Indicator */}
                  {index < studentFlow.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2"
                    >
                      <ArrowRight className="w-6 h-6 text-accent" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Additional Benefits
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhanced features designed to provide you with the best admission
            experience
          </p>
        </motion.div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 mx-auto`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground mb-2 text-center">
                {feature.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
