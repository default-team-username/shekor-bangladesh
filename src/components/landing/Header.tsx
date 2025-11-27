import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout } from "lucide-react";

export const Header = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground md:text-2xl">
            HarvestGuard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            {language === "en" ? "Login" : "লগইন"}
          </Button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <span className={language === "en" ? "font-bold" : ""}>EN</span>
            <span className="text-primary-foreground/50">|</span>
            <span className={language === "bn" ? "font-bold" : ""}>BN</span>
          </button>
        </div>
      </div>
    </header>
  );
};
