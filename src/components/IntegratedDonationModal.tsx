'use client';

import { Coffee, Heart, Server, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { KofiSimpleButton } from './KofiWidget';

interface IntegratedDonationModalProps {
  displayName?: string;
  kofiUsername?: string;
}

export function IntegratedDonationModal({ 
  displayName = 'Takuma Lee',
  kofiUsername = 'nebulab'
}: IntegratedDonationModalProps) {
  return (
    <div className="space-y-4">
      {/* 支持理由區塊 */}
      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-warning/10 border-secondary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-secondary">
            <Heart className="w-5 h-5" />
            <h3 className="font-semibold text-lg">感謝您使用特典速報！</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            我們是由 <span className="font-medium text-foreground">{displayName}</span> 維護的專案，致力於為您提供最即時、最完整的電影特典資訊。
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Server className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <div className="font-medium text-sm">維持伺服器</div>
                <div className="text-xs text-muted-foreground">24/7 穩定運行</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <RefreshCw className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <div className="font-medium text-sm">持續更新</div>
                <div className="text-xs text-muted-foreground">即時電影資訊</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <div className="font-medium text-sm">開發新功能</div>
                <div className="text-xs text-muted-foreground">更好的體驗</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Separator className="my-2" />
      
      {/* Ko-fi 嵌入區域 */}
      <div className="relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-4 py-1 rounded-full border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coffee className="w-4 h-4" />
            <span>選擇您的支持方式</span>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <KofiSimpleButton id={kofiUsername} />
          </div>
        </div>
      </div>
      
      {/* 底部提示 */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          您的每一份支持都是我們前進的動力 💪
        </p>
      </div>
    </div>
  );
}