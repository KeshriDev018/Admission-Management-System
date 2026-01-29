import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden min-h-[600px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/3.webp"
          alt="IIIT Dharwad Campus"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="IIIT Dharwad"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">IDAP</h3>
                <p className="text-xs text-white/60">IIIT Dharwad</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Professional Admission Management System — digitizing the complete
              admission workflow for excellence in education.
            </p>

            {/* Address & Phone */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-xs text-white/70 leading-relaxed">
                  IIIT Dharwad, Ittigatti Road, Near Sattur Colony, Dharwad -
                  580009
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <div className="text-xs text-white/70 space-y-1">
                  <div>0836 2250879</div>
                  <div>9449732959</div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-white/90">
                FOLLOW US
              </h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/iiit.dharwad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/indian-institute-of-information-technology-dharwad-karnataka/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@socialmediaiiitdharwad2584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/dharwad_iiit?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Apply Now", href: "/register" },
                { label: "Login", href: "/login" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admission Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90 uppercase tracking-wider text-sm">
              Admission Info
            </h4>
            <ul className="space-y-2.5">
              {[
                "B.Tech Programs",
                "M.Tech Programs",
                "PhD Programs",
                "Important Dates",
                "Fee Structure",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60 hover:text-accent transition-colors cursor-pointer inline-block hover:translate-x-1 duration-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90 uppercase tracking-wider text-sm">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="tel:+918362250879"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  +91-836-2250879
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="mailto:admissions@iiitdwd.ac.in"
                  className="text-sm text-white/60 hover:text-accent transition-colors break-all"
                >
                  admissions@iiitdwd.ac.in
                </a>
              </li>
            </ul>

            {/* Explore Button */}
            <a
              href="https://iiitdwd.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-between w-full px-6 py-3 rounded-lg border border-white/20 hover:border-accent bg-white/5 hover:bg-accent/10 transition-all duration-300 group"
            >
              <span className="text-sm font-semibold">Explore</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2025 IIIT Dharwad. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/50 hover:text-accent transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-sm text-white/50 hover:text-accent transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
