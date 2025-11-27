import { useLanguage } from "@/contexts/LanguageContext";
import { Scale, Wheat, Wallet } from "lucide-react";

export const FactsSection = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          {language === "en" ? "Food Loss in Bangladesh" : "বাংলাদেশে খাদ্য ক্ষতি"}
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl bg-background p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Scale className="h-10 w-10 text-primary" />
            </div>
            <h4 className="mb-2 text-3xl font-bold text-primary">
              {language === "en" ? "4.5M" : "৪.৫ মিলিয়ন"}
            </h4>
            <p className="mb-2 font-semibold text-foreground">
              {language === "en" ? "tonnes" : "টন"}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {language === "en"
                ? "Food lost every year"
                : "প্রতি বছর খাদ্যের ক্ষতি"}
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-background p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Wheat className="h-10 w-10 text-primary" />
            </div>
            <h4 className="mb-2 text-3xl font-bold text-primary">
              {language === "en" ? "12-32%" : "১২-৩২%"}
            </h4>
            <p className="mb-2 font-semibold text-foreground">
              {language === "en" ? "loss rate" : "ক্ষতির হার"}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {language === "en"
                ? "Staple food crops lost"
                : "প্রধান খাদ্য শস্যের ক্ষতি"}
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-background p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h4 className="mb-2 text-3xl font-bold text-primary">
              {language === "en" ? "$1.5B" : "$১.৫ বিলিয়ন"}
            </h4>
            <p className="mb-2 font-semibold text-foreground">
              {language === "en" ? "economic loss" : "অর্থনৈতিক ক্ষতি"}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {language === "en"
                ? "Lost value annually"
                : "বার্ষিক ক্ষতির মূল্য"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
