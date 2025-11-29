import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { InteractiveInfoSection } from "@/components/landing/InteractiveInfoSection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <WorkflowSection />
        <InteractiveInfoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;