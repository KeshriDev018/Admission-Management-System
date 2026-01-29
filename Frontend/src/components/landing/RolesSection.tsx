import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Monitor,
  BookOpen,
  FileText,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const programs = [
  {
    icon: GraduationCap,
    title: "Under-Graduate Programs",
    description:
      "Explore top ranked bachelor's degrees in Computer Science and Engineering with cutting-edge curriculum.",
    image: "/1.webp",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Monitor,
    title: "Online Programs",
    description:
      "Find the rigorous training the university is known for online with flexible learning schedules.",
    image: "/2.webp",
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: BookOpen,
    title: "Major Programs",
    description:
      "Browse core degree programs with detailed course requirements, curriculum and career prospects.",
    image: "/3.webp",
    gradient: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: FileText,
    title: "Minor Programs",
    description:
      "Explore minors that add depth or breadth to your main degree with interdisciplinary focus.",
    image: "/4.webp",
    gradient: "from-cyan-500 to-cyan-600",
    iconBg: "bg-cyan-500/10 text-cyan-500",
  },
];

const RolesSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["INNOVATION", "LEARNING", "EXCELLENCE", "DISCOVERY"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExplore = () => {
    window.open("https://iiitdwd.ac.in/academics/programmes/", "_blank");
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
          >
            Academic Programs
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            THE PERSISTENT PURSUIT OF
            <span className="block mt-2 h-16 md:h-20 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're driven by our meaningful mission to provide an education that
            propels our state, nation and world forward with cutting-edge
            technology and research.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-300 h-full"
              >
                {/* Image with Overlay */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}
                  />

                  {/* Icon Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    className="absolute top-4 right-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${program.iconBg} backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg`}
                    >
                      <program.icon className="w-6 h-6" />
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {program.description}
                  </p>

                  {/* Explore Button */}
                  <motion.button
                    onClick={handleExplore}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn"
                  >
                    <span className="relative">
                      EXPLORE
                      <motion.span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/btn:w-full transition-all duration-300" />
                    </span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className={`absolute inset-0 bg-gradient-to-tl ${program.gradient} rounded-tl-full`}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            onClick={handleExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default RolesSection;
