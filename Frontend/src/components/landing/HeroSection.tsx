import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/1.webp",
    "/2.webp",
    "/3.webp",
    "/4.webp",
    "/5.webp",
    "/6.webp",
    "/7.webp",
    "/8.webp",
    "/9.webp",
    "/10.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={images[currentImage]}
              alt={`Background ${currentImage + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay for Better Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Additional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/30" />
      </div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 opacity-20 hidden md:block">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-dark text-white backdrop-blur-md text-xs sm:text-sm mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Admissions 2025-26 Open
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl"
          >
            IIIT Dharwad
            <span className="block mt-2">Admission Portal</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-2"
          >
            Streamlined digital admission workflow for{" "}
            <span className="text-accent font-semibold">IIIT Dharwad</span> —
            from registration to enrollment, all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 md:mb-16"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="xl"
                className="group shadow-2xl w-full sm:w-auto"
              >
                Apply Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="hero-outline"
                size="xl"
                className="backdrop-blur-md shadow-xl w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Image Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-2 sm:gap-3 justify-center mb-12 sm:mb-16 md:mb-20"
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "w-8 sm:w-12 bg-accent shadow-lg"
                    : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Users,
                label: "Applications",
                value: "5,000+",
                desc: "Per Year",
              },
              {
                icon: GraduationCap,
                label: "Programs",
                value: "8+",
                desc: "Undergraduate & PG",
              },
              {
                icon: Shield,
                label: "Secure",
                value: "100%",
                desc: "Data Protected",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="glass-dark backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center border border-white/10"
              >
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80">
                  {stat.label}
                </div>
                <div className="text-xs text-white/60 mt-1">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
