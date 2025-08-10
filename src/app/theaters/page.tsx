'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home, ArrowLeft, Sparkles, Building } from 'lucide-react';
import { SmartNavigation } from '@/components/SmartNavigation';

export default function TheatersPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SmartNavigation />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-primary/20 bg-card/50">
            <CardContent className="p-8 sm:p-12">
              {/* Animated Theater Icons */}
              <div className="relative mb-8">
                <div className="relative">
                  <MapPin className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto animate-bounce" />
                  <Building className="w-6 h-6 text-muted-foreground absolute -bottom-1 -right-1 animate-pulse" />
                </div>
                <div className="absolute -top-3 -left-3 flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-300"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping animation-delay-600"></div>
                </div>
                <Sparkles className="w-5 h-5 text-orange-500 absolute -top-1 -right-2 animate-spin animation-duration-4000" />
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
                戲院資訊
              </h1>
              
              {/* Under Construction Message */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  🏢 施工中 🏢
                </h2>
                <p className="text-lg text-muted-foreground">
                  全台戲院資訊平台正在建置中
                </p>
                <p className="text-base text-muted-foreground">
                  我們正在整合全台影城的最新資訊與服務
                </p>
                
                {/* Coming Soon with Animation */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <MapPin className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">即將推出</span>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>

              {/* Feature Preview */}
              <div className="text-sm text-muted-foreground mb-8 space-y-2">
                <p>🎪 全台影城資訊</p>
                <p>📍 交通位置指南</p>
                <p>🎫 訂票服務連結</p>
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