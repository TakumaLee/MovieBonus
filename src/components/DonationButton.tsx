'use client';

import { useState, useEffect } from 'react';
import { Heart, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DonationButtonProps {
  position?: 'header' | 'floating' | 'footer';
  kofiUsername?: string;
  displayName?: string;
}

export function DonationButton({ 
  position = 'header',
  kofiUsername = 'nebulab',
  displayName = 'Takuma Lee'
}: DonationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 延遲顯示按鈕，避免干擾初次訪問
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDonateClick = () => {
    setIsOpen(true);
  };

  const handleKofiClick = () => {
    window.open(`https://ko-fi.com/${kofiUsername}`, '_blank');
    setIsOpen(false);
  };

  // 根據不同位置返回不同樣式的按鈕
  const renderButton = () => {
    switch (position) {
      case 'header':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDonateClick}
            className="donation-button-header"
          >
            <Coffee className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">請我們喝咖啡</span>
          </Button>
        );
      
      case 'floating':
        return (
          <div className={`fixed bottom-24 left-4 z-30 transition-all duration-300 ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Button
              size="icon"
              onClick={handleDonateClick}
              className="donation-button-floating h-12 w-12 rounded-full shadow-lg"
            >
              <Coffee className="w-5 h-5" />
            </Button>
          </div>
        );
      
      case 'footer':
        return (
          <button
            onClick={handleDonateClick}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            支持特典速報
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {renderButton()}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-orange-500" />
              支持特典速報
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-3">
              <p>感謝您使用特典速報！</p>
              <p>我們是由 {displayName} 維護的專案，您的支持能幫助我們：</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>維持伺服器運行</li>
                <li>持續更新電影資訊</li>
                <li>開發新功能</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              onClick={handleKofiClick}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              <Coffee className="w-4 h-4 mr-2" />
              前往 Ko-fi 贊助
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              稍後再說
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}