import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Globe, FileText } from "lucide-react";

export const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5" />
              {language === "en" ? "Useful Articles" : "প্রয়োজনীয় নিবন্ধ"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="transition-colors hover:text-accent">
                  {language === "en"
                    ? "Best Storage Practices"
                    : "সেরা সংরক্ষণ পদ্ধতি"}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-accent">
                  {language === "en"
                    ? "Weather Monitoring Tips"
                    : "আবহাওয়া পর্যবেক্ষণের টিপস"}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-accent">
                  {language === "en"
                    ? "Crop Protection Guide"
                    : "ফসল সুরক্ষা গাইড"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Phone className="h-5 w-5" />
              {language === "en" ? "Hotline" : "হটলাইন"}
            </h4>
            <p className="mb-2 text-xl font-bold">+880 1234-567890</p>
            <p className="text-sm text-primary-foreground/80">
              {language === "en"
                ? "Available 24/7 for support"
                : "২৪/৭ সহায়তার জন্য উপলব্ধ"}
            </p>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Globe className="h-5 w-5" />
              {language === "en" ? "Website" : "ওয়েবসাইট"}
            </h4>
            <a
              href="https://harvestguard.com"
              className="block text-accent transition-colors hover:underline"
            >
              www.harvestguard.com
            </a>
            <p className="mt-4 text-sm text-primary-foreground/60">
              {language === "en"
                ? "Developed for Hackathon 2025"
                : "হ্যাকাথন ২০২৫ এর জন্য তৈরি"}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 HarvestGuard. {language === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।"}</p>
        </div>
      </div>
    </footer>
  );
};
