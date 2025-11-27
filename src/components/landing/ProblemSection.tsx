import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, TrendingDown, DollarSign } from "lucide-react";

export const ProblemSection = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          {language === "en" ? "The Problem" : "সমস্যা"}
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <TrendingDown className="h-8 w-8 text-primary-foreground" />
            </div>
            <h4 className="mb-2 text-2xl font-bold text-primary">
              {language === "en" ? "4.5M tonnes" : "৪.৫ মিলিয়ন টন"}
            </h4>
            <p className="text-foreground">
              {language === "en"
                ? "Food lost yearly in Bangladesh"
                : "বাংলাদেশে প্রতি বছর খাদ্যের ক্ষতি"}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <AlertTriangle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h4 className="mb-2 text-2xl font-bold text-primary">
              {language === "en" ? "12-32%" : "১২-৩২%"}
            </h4>
            <p className="text-foreground">
              {language === "en"
                ? "Staple food crops lost"
                : "প্রধান খাদ্য শস্যের ক্ষতি"}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
            <h4 className="mb-2 text-2xl font-bold text-primary">
              {language === "en" ? "$1.5B" : "$১.৫ বিলিয়ন"}
            </h4>
            <p className="text-foreground">
              {language === "en"
                ? "Annual economic loss"
                : "বার্ষিক অর্থনৈতিক ক্ষতি"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
