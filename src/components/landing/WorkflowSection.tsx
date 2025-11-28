import { useLanguage } from "@/contexts/LanguageContext";
import workflowStep1 from "@/assets/workflow-step-1.jpg";
import workflowStep2 from "@/assets/workflow-step-2.jpg";
import workflowStep3 from "@/assets/workflow-step-3.jpg";
import workflowStep4 from "@/assets/workflow-step-4.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const WorkflowSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      image: workflowStep1,
      titleEn: "Farmer Collects Data",
      titleBn: "কৃষক তথ্য সংগ্রহ করেন",
      descEn: "Using mobile app to record crop and storage conditions",
      descBn: "মোবাইল অ্যাপ ব্যবহার করে ফসল ও সংরক্ষণের তথ্য রেকর্ড করেন",
    },
    {
      image: workflowStep2,
      titleEn: "AI Risk Detection",
      titleBn: "এআই ঝুঁকি শনাক্তকরণ",
      descEn: "System analyzes weather patterns and moisture levels",
      descBn: "সিস্টেম আবহাওয়ার ধরন এবং আর্দ্রতার মাত্রা বিশ্লেষণ করে",
    },
    {
      image: workflowStep3,
      titleEn: "Warning Alert Sent",
      titleBn: "সতর্কতা সংকেত পাঠানো",
      descEn: "Instant notifications about potential food loss risks",
      descBn: "সম্ভাব্য খাদ্য ক্ষতির ঝুঁকি সম্পর্কে তাৎক্ষণিক বিজ্ঞপ্তি",
    },
    {
      image: workflowStep4,
      titleEn: "Crops Saved!",
      titleBn: "ফসল রক্ষা পেয়েছে!",
      descEn: "Timely action prevents losses and protects livelihoods",
      descBn: "সময়মত পদক্ষেপ ক্ষতি রোধ করে এবং জীবিকা রক্ষা করে",
    },
  ];

  return (
    <section id="workflow" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h3 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
          {language === "en" ? "How It Works" : "কিভাবে কাজ করে"}
        </h3>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          {language === "en"
            ? "Simple steps to protect your harvest"
            : "আপনার ফসল রক্ষার সহজ পদক্ষেপ"}
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="mx-auto w-full max-w-5xl"
        >
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem key={index}>
                <div className="p-4">
                  <div className="flex flex-col items-center gap-6 rounded-2xl bg-secondary p-8 shadow-xl">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                      {index + 1}
                    </div>

                    <div className="h-64 w-full overflow-hidden rounded-xl shadow-lg md:h-80">
                      <img
                        src={step.image}
                        alt={language === "en" ? step.titleEn : step.titleBn}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <h4 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                        {language === "en" ? step.titleEn : step.titleBn}
                      </h4>
                      <p className="text-lg text-muted-foreground">
                        {language === "en" ? step.descEn : step.descBn}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {language === "en" 
            ? "Auto-playing • Swipe or click arrows to navigate" 
            : "স্বয়ংক্রিয় • নেভিগেট করতে সোয়াইপ করুন বা তীর ক্লিক করুন"}
        </div>
      </div>
    </section>
  );
};
