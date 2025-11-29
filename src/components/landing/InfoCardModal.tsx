import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoArticle } from '@/data/infoData';

interface InfoCardModalProps {
  article: InfoArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoCardModal: React.FC<InfoCardModalProps> = ({ article, isOpen, onClose }) => {
  const { language } = useLanguage();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  if (!article) return null;

  const ArticleIcon = article.icon;
  const title = getTranslation(article.titleEn, article.titleBn);
  const content = getTranslation(article.articleEn, article.articleBn);

  // Function to render content with simple bolding and line breaks
  const renderContent = (text: string) => {
    return text.split('\n').filter(line => line.trim() !== '').map((line, index) => (
      <p 
        key={index} 
        className="leading-relaxed mb-2" 
        // Simple replacement for **bold** syntax
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[95%] rounded-2xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <ArticleIcon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {/* Article Content */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm text-foreground">
          {renderContent(content)}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full h-10 text-lg font-semibold rounded-xl">
            {getTranslation("Go Back", "ফিরে যান")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoCardModal;