import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RolesSection from "@/components/landing/RolesSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>IDAP - IIIT Dharwad Admission Portal</title>
        <meta
          name="description"
          content="Streamlined digital admission workflow for IIIT Dharwad. Apply for B.Tech, M.Tech, and PhD programs with our professional admission management system."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <div id="home">
          <HeroSection />
        </div>
        <div id="about">
          <FeaturesSection />
        </div>
        <div id="programs">
          <RolesSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
