import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { FactsSection } from "@/components/landing/FactsSection";
import { Footer } from "@/components/landing/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Landing = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <ProblemSection />
          <WorkflowSection />
          <FactsSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Landing;
