'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Construction, Home, ArrowLeft, Sparkles } from 'lucide-react';
import { SmartNavigation } from '@/components/SmartNavigation';

export default function BonusesPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SmartNavigation />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-primary/20 bg-card/50">
            <CardContent className="p-8 sm:p-12">
              {/* Animated Construction Icon */}
              <div className="relative mb-8">
                <Construction className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto animate-bounce" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="w-4 h-4 text-blue-500 absolute -bottom-1 -left-3 animate-ping" />
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
                特典情報
              </h1>
              
              {/* Under Construction Message */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  🚧 施工中 🚧
                </h2>
                <p className="text-lg text-muted-foreground">
                  精彩的特典情報頁面正在建設中
                </p>
                <p className="text-base text-muted-foreground">
                  我們正在努力為您打造最完整的電影特典資訊平台
                </p>
                
                {/* Coming Soon with Animation */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">即將推出</span>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-500"></div>
                </div>
              </div>

              {/* Feature Preview */}
              <div className="text-sm text-muted-foreground mb-8 space-y-2">
                <p>🎁 限定特典追蹤</p>
                <p>🎬 電影院獨家好康</p>
                <p>⏰ 即時更新通知</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="default" size="lg" className="group">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    返回首頁
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="group">
                  <Link href="/blog" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    瀏覽文章
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}