import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from '@/components/ui/card';
import { infoArticles, InfoArticle } from '@/data/infoData';
import InfoCardModal from './InfoCardModal';

export const InteractiveInfoSection = () => {
  const { language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<InfoArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  const handleCardClick = (article: InfoArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          {getTranslation("Essential Guides", "প্রয়োজনীয় নির্দেশিকা")}
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          {infoArticles.map((article) => {
            const ArticleIcon = article.icon;
            return (
              <Card 
                key={article.key}
                className="flex flex-col items-center rounded-2xl bg-background p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onClick={() => handleCardClick(article)}
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <ArticleIcon className="h-10 w-10 text-primary" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-primary text-center">
                  {getTranslation(article.titleEn, article.titleBn)}
                </h4>
                <p className="text-center text-sm text-muted-foreground">
                  {getTranslation(article.summaryEn, article.summaryBn)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
      
      <InfoCardModal 
        article={selectedArticle} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};