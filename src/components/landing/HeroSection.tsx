import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const { language } = useLanguage();

  const scrollToWorkflow = () => {
    document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
        <h2 className="mb-8 text-4xl font-bold text-primary-foreground drop-shadow-lg md:text-5xl lg:text-6xl">
          {language === "en" ? "HarvestGuard" : "হারভেস্টগার্ড"}
        </h2>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="min-w-[140px] bg-primary-foreground text-lg font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            {language === "en" ? "Join Now" : "যোগ দিন"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={scrollToWorkflow}
            className="min-w-[140px] border-2 border-primary-foreground bg-transparent text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary-foreground/20 hover:text-primary-foreground"
          >
            {language === "en" ? "Explore" : "ঘুরে দেখুন"}
          </Button>
        </div>

        <p className="mb-12 max-w-2xl text-lg font-medium text-primary-foreground/95 drop-shadow md:text-xl">
          {language === "en"
            ? "HarvestGuard is here to protect a farmer's livelihood"
            : "একজন কৃষকের জীবনকে নিরাপদ রাখতে হারভেস্টগার্ড আপনার পাশে।"}
        </p>

        <div className="animate-bounce">
          <div className="h-1 w-6 rounded-full bg-primary-foreground/70" />
        </div>
      </div>
    </section>
  );
};
