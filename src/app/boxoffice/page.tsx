'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Home, ArrowLeft, Sparkles, BarChart3 } from 'lucide-react';
import { SmartNavigation } from '@/components/SmartNavigation';

export default function BoxofficePage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SmartNavigation />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-primary/20 bg-card/50">
            <CardContent className="p-8 sm:p-12">
              {/* Animated Chart Icons */}
              <div className="relative mb-8">
                <div className="relative">
                  <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto animate-pulse" />
                  <BarChart3 className="w-8 h-8 text-muted-foreground absolute -bottom-2 -left-2 animate-bounce animation-delay-500" />
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                    <div className="w-1 h-6 bg-blue-500 animate-pulse animation-delay-200"></div>
                    <div className="w-1 h-5 bg-purple-500 animate-pulse animation-delay-400"></div>
                    <div className="w-1 h-7 bg-orange-500 animate-pulse animation-delay-600"></div>
                    <div className="w-1 h-3 bg-red-500 animate-pulse animation-delay-800"></div>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1 animate-spin animation-duration-2000" />
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
                票房分析
              </h1>
              
              {/* Under Construction Message */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  📊 施工中 📊
                </h2>
                <p className="text-lg text-muted-foreground">
                  專業票房分析平台正在開發中
                </p>
                <p className="text-base text-muted-foreground">
                  我們正在建立完整的票房數據追蹤與分析系統
                </p>
                
                {/* Coming Soon with Animation */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <TrendingUp className="w-3 h-3 text-primary animate-bounce" />
                  <span className="text-sm font-medium text-primary">即將推出</span>
                  <div className="flex gap-0.5 ml-1">
                    <div className="w-1 h-2 bg-primary animate-pulse"></div>
                    <div className="w-1 h-3 bg-primary animate-pulse animation-delay-150"></div>
                    <div className="w-1 h-2 bg-primary animate-pulse animation-delay-300"></div>
                  </div>
                </div>
              </div>

              {/* Feature Preview */}
              <div className="text-sm text-muted-foreground mb-8 space-y-2">
                <p>📈 即時票房數據</p>
                <p>🏆 排行榜追蹤</p>
                <p>📊 趨勢分析圖表</p>
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