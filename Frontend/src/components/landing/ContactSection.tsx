import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  GraduationCap,
  Briefcase,
  Shield,
  Users,
  Laptop,
  TrendingUp,
  BookOpen,
  Building2,
} from "lucide-react";

const contactCategories = [
  {
    icon: GraduationCap,
    title: "Undergraduate Admissions",
    color: "bg-blue-500/10 text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/20",
    contacts: [
      { type: "phone", value: "+91 836 2250879", icon: Phone },
      { type: "email", value: "contact@iiitdwd.ac.in", icon: Mail },
    ],
  },
  {
    icon: BookOpen,
    title: "Graduate (Ph.D.) Admissions",
    color: "bg-purple-500/10 text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/20",
    contacts: [
      { type: "phone", value: "+91 836 2250879", icon: Phone },
      { type: "email", value: "contact@iiitdwd.ac.in", icon: Mail },
    ],
  },
  {
    icon: Briefcase,
    title: "Placements & Internships",
    color: "bg-green-500/10 text-green-500",
    gradient: "from-green-500/20 to-green-600/20",
    contacts: [
      { type: "phone", value: "+91 836 2250879", icon: Phone },
      { type: "email", value: "cgc@iiitdwd.ac.in", icon: Mail },
    ],
  },
  {
    icon: Shield,
    title: "Student Verification",
    color: "bg-amber-500/10 text-amber-500",
    gradient: "from-amber-500/20 to-amber-600/20",
    contacts: [
      { type: "email", value: "UG: contact@iiitdwd.ac.in", icon: Mail },
      { type: "email", value: "Ph.D.: contact@iiitdwd.ac.in", icon: Mail },
    ],
  },
  {
    icon: TrendingUp,
    title: "Career Guidance & Corporate Relations",
    color: "bg-indigo-500/10 text-indigo-500",
    gradient: "from-indigo-500/20 to-indigo-600/20",
    contacts: [{ type: "email", value: "cgcoffice@iiitdwd.ac.in", icon: Mail }],
  },
  {
    icon: Laptop,
    title: "IT Support & Tech Assistance",
    color: "bg-cyan-500/10 text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-600/20",
    contacts: [
      { type: "phone", value: "+91 836 2250879", icon: Phone },
      { type: "email", value: "contact@iiitdwd.ac.in", icon: Mail },
    ],
  },
  {
    icon: Shield,
    title: "Campus Security",
    color: "bg-red-500/10 text-red-500",
    gradient: "from-red-500/20 to-red-600/20",
    contacts: [
      { type: "phone", value: "+91 836 2250879", icon: Phone },
      { type: "emergency", value: "Emergency: 112", icon: Phone },
    ],
  },
  {
    icon: TrendingUp,
    title: "Marketing & Public Relations",
    color: "bg-pink-500/10 text-pink-500",
    gradient: "from-pink-500/20 to-pink-600/20",
    contacts: [{ type: "email", value: "contact@iiitdwd.ac.in", icon: Mail }],
  },
  {
    icon: Users,
    title: "Human Resources",
    color: "bg-violet-500/10 text-violet-500",
    gradient: "from-violet-500/20 to-violet-600/20",
    contacts: [{ type: "email", value: "contact@iiitdwd.ac.in", icon: Mail }],
  },
  {
    icon: BookOpen,
    title: "Library Services",
    color: "bg-emerald-500/10 text-emerald-500",
    gradient: "from-emerald-500/20 to-emerald-600/20",
    contacts: [{ type: "email", value: "contact@iiitdwd.ac.in", icon: Mail }],
  },
];

const ContactSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
            Get in Touch
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            For directions, transportation options, and campus access details,
            visit our How to Reach Us page. To check office timings and
            availability, refer to our Working Hours section.
          </p>
        </motion.div>

        {/* Main Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {/* Institute Address */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">
              Institute Address
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Indian Institute of Information Technology Dharwad,
              <br />
              Ittigatti Rd, near Sattur Colony,
              <br />
              Karnataka 580009
            </p>
          </motion.div>

          {/* Institute Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">
              Institute Phone
            </h3>
            <div className="space-y-2">
              <a
                href="tel:+918362250879"
                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                8362250879
              </a>
              <a
                href="tel:+919449732959"
                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                9449732959
              </a>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">
              Working Hours
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Monday – Friday:</p>
              <p className="font-semibold text-foreground">9:00 AM – 5:30 PM</p>
              <p className="mt-2">Saturday – Sunday: Closed</p>
              <p className="text-xs mt-2">Holidays: As per official calendar</p>
            </div>
          </motion.div>
        </div>

        {/* Departmental Contacts Grid */}
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
          >
            Departmental Contacts
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-5 rounded-xl bg-gradient-to-br ${category.gradient} border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight">
                    {category.title}
                  </h4>
                </div>

                <div className="space-y-2">
                  {category.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <contact.icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      {contact.type === "email" ? (
                        <a
                          href={`mailto:${
                            contact.value.includes(":")
                              ? contact.value.split(": ")[1]
                              : contact.value
                          }`}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          {contact.value}
                        </a>
                      ) : contact.type === "phone" ? (
                        <a
                          href={`tel:${contact.value.replace(/\s/g, "")}`}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {contact.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map or Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://www.google.com/maps/place/Indian+Institute+of+Information+Technology+Dharwad/@15.3777,75.0234,17z"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MapPin className="w-5 h-5" />
            <span>View on Google Maps</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
