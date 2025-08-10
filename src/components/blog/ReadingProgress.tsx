/**
 * ReadingProgress Component
 * 
 * Visual reading progress indicator with scroll tracking,
 * section highlighting, and user engagement analytics
 */

'use client';

import React, { useState, useEffect, useRef, RefObject } from 'react';
import { ChevronUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReadingProgress as ReadingProgressType } from '@/lib/types';
import { trackEngagement } from '@/lib/blog-api-client';

interface ReadingProgressProps {
  articleRef: RefObject<HTMLElement>;
  postId?: string;
  showPercentage?: boolean;
  showTimeEstimate?: boolean;
  position?: 'top' | 'bottom';
  variant?: 'bar' | 'circular' | 'minimal';
  className?: string;
}

export default function ReadingProgressIndicator({
  articleRef,
  postId,
  showPercentage = true,
  showTimeEstimate = false,
  position = 'top',
  variant = 'bar',
  className = ''
}: ReadingProgressProps) {
  const [progress, setProgress] = useState<ReadingProgressType>({
    totalHeight: 0,
    currentPosition: 0,
    percentage: 0,
    currentSection: '',
    timeSpent: 0
  });
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const startTimeRef = useRef(Date.now());
  const lastEngagementRef = useRef(Date.now());

  // Calculate reading progress
  useEffect(() => {
    const calculateProgress = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = element.offsetHeight;
      
      // Calculate scroll position relative to article
      const scrollTop = window.pageYOffset;
      const elementTop = element.offsetTop;
      const elementBottom = elementTop + documentHeight;
      
      // Calculate progress
      const articleScrolled = Math.max(0, scrollTop - elementTop);
      const maxScroll = Math.max(1, documentHeight - windowHeight);
      const percentage = Math.min(100, Math.max(0, (articleScrolled / maxScroll) * 100));
      
      // Show back to top when scrolled significantly
      setShowBackToTop(percentage > 20);
      
      // Calculate time spent
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Find current section (simplified)
      const currentSection = getCurrentSection(articleScrolled, documentHeight);
      
      setProgress({
        totalHeight: documentHeight,
        currentPosition: articleScrolled,
        percentage,
        currentSection,
        timeSpent
      });

      // Track engagement periodically (every 30 seconds)
      if (Date.now() - lastEngagementRef.current > 30000) {
        trackUserEngagement(percentage, timeSpent);
        lastEngagementRef.current = Date.now();
      }
    };

    // Handle scroll direction for auto-hide
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      }
      
      calculateProgress();
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    calculateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      // Final engagement tracking
      trackUserEngagement(progress.percentage, progress.timeSpent);
    };
  }, [articleRef, postId, progress.percentage, progress.timeSpent, lastScrollY]);

  // Estimate reading time from content
  useEffect(() => {
    if (articleRef.current) {
      const wordCount = articleRef.current.textContent?.split(/\s+/).length || 0;
      const estimatedMinutes = Math.ceil(wordCount / 200); // 200 words per minute
      setEstimatedReadTime(estimatedMinutes);
    }
  }, [articleRef]);

  // Track user engagement
  const trackUserEngagement = async (scrollDepth: number, timeOnPage: number) => {
    if (!postId) return;

    try {
      await trackEngagement(postId, {
        scroll_depth: scrollDepth,
        time_on_page: timeOnPage,
        interactions: 1
      });
    } catch (error) {
      console.error('Failed to track engagement:', error);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get current section based on scroll position
  const getCurrentSection = (scrolled: number, totalHeight: number): string => {
    const percentage = (scrolled / totalHeight) * 100;
    
    if (percentage < 10) return '開始閱讀';
    if (percentage < 25) return '前言';
    if (percentage < 50) return '主要內容';
    if (percentage < 75) return '深入討論';
    if (percentage < 95) return '總結';
    return '閱讀完成';
  };

  if (variant === 'bar') {
    return (
      <div className={`${className}`}>
        {/* Progress Bar */}
        <div className={`fixed ${
          position === 'top' ? 'top-0' : 'bottom-0'
        } left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'transform-none' : position === 'top' ? '-translate-y-full' : 'translate-y-full'
        }`}>
          <div className="bg-background/95 backdrop-blur-sm border-b shadow-sm">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {progress.currentSection}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {showTimeEstimate && (
                        <Badge variant="secondary" className="text-xs">
                          約 {Math.max(1, estimatedReadTime - Math.floor(progress.timeSpent / 60))} 分鐘
                        </Badge>
                      )}
                      
                      {showPercentage && (
                        <span className="text-sm font-medium">
                          {Math.round(progress.percentage)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Progress 
                    value={progress.percentage} 
                    className="h-2"
                  />
                </div>

                {showBackToTop && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scrollToTop}
                    className="h-8 px-2"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Stats (floating) */}
        {progress.percentage > 10 && (
          <Card className="fixed bottom-4 right-4 z-40 hidden lg:block">
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(progress.percentage)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  閱讀進度
                </div>
                {progress.timeSpent > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {Math.floor(progress.timeSpent / 60)}:{(progress.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <Card className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <CardContent className="p-4">
          <div className="relative w-16 h-16">
            {/* Circular Progress */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progress.percentage * 0.88} 88`}
                className="text-primary transition-all duration-300"
              />
            </svg>
            
            {/* Percentage in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">
                {Math.round(progress.percentage)}%
              </span>
            </div>
          </div>

          {showBackToTop && progress.percentage > 20 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="w-full mt-2 h-8"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`fixed ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } left-0 right-0 z-50 ${className}`}>
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return null;
}

// Throttle utility function
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Reading time estimator component
export function ReadingTimeEstimate({ 
  content, 
  className = '' 
}: { 
  content: string; 
  className?: string; 
}) {
  const wordCount = content.split(/\s+/).length;
  const estimatedMinutes = Math.ceil(wordCount / 200);

  return (
    <Badge variant="secondary" className={`${className}`}>
      <BookOpen className="w-3 h-3 mr-1" />
      約 {estimatedMinutes} 分鐘閱讀
    </Badge>
  );
}

// Progress summary for post completion
export function ReadingSummary({ 
  progress, 
  className = '' 
}: { 
  progress: ReadingProgressType; 
  className?: string; 
}) {
  const isCompleted = progress.percentage >= 95;
  
  if (!isCompleted) return null;

  return (
    <Card className={`${className} border-green-200 bg-green-50`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-green-600 mb-2">
            <BookOpen className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-green-800 mb-1">
            恭喜您完成閱讀！
          </h3>
          <p className="text-sm text-green-700">
            閱讀時間：{Math.floor(progress.timeSpent / 60)} 分 {progress.timeSpent % 60} 秒
          </p>
        </div>
      </CardContent>
    </Card>
  );
}