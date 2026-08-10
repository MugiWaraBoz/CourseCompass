// App.jsx controls the order of the main sections shown on the homepage.
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import FeaturedFacultySection from "@/components/home/FeaturedFacultySection";
import PlatformBenefitsSection from "@/components/home/PlatformBenefitsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* Homepage sections appear from top to bottom in this order. */}
        <HeroSection />
        <FeaturedCoursesSection />
        <FeaturedFacultySection />
        <PlatformBenefitsSection />
        <HowItWorksSection />
        <AboutSection />
        <FinalCtaSection />
      </main>
      {/* The footer appears after all homepage content. */}
      <Footer />
    </>
  );
}

export default App;
