'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Home, ArrowLeft, Sparkles, Film } from 'lucide-react';
import { SmartNavigation } from '@/components/SmartNavigation';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SmartNavigation />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-primary/20 bg-card/50">
            <CardContent className="p-8 sm:p-12">
              {/* Animated Review Icons */}
              <div className="relative mb-8">
                <div className="relative">
                  <Star className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto animate-pulse" fill="currentColor" />
                  <Film className="w-8 h-8 text-muted-foreground absolute -top-2 -left-4 animate-bounce animation-delay-300" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-spin animation-duration-3000" />
                <Sparkles className="w-4 h-4 text-purple-500 absolute -bottom-2 -left-2 animate-pulse animation-delay-700" />
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
                影評專欄
              </h1>
              
              {/* Under Construction Message */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  🎬 施工中 🎬
                </h2>
                <p className="text-lg text-muted-foreground">
                  專業影評專欄正在精心籌備中
                </p>
                <p className="text-base text-muted-foreground">
                  我們正在邀請資深影評人為您帶來深度電影分析
                </p>
                
                {/* Coming Soon with Animation */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                  <span className="text-sm font-medium text-primary">即將推出</span>
                </div>
              </div>

              {/* Feature Preview */}
              <div className="text-sm text-muted-foreground mb-8 space-y-2">
                <p>⭐ 專業影評分析</p>
                <p>🎭 深度劇情解讀</p>
                <p>🎯 觀影推薦指南</p>
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