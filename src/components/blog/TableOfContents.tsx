/**
 * TableOfContents Component
 * 
 * Dynamic table of contents with scroll tracking,
 * smooth navigation, and responsive design
 */

'use client';

import React, { useState, useEffect, useRef, RefObject } from 'react';
import { 
  List, 
  ChevronRight, 
  ChevronDown,
  BookOpen,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { TableOfContentsItem } from '@/lib/types';

interface TableOfContentsProps {
  articleRef: RefObject<HTMLElement>;
  variant?: 'sidebar' | 'floating' | 'inline' | 'mobile';
  showProgress?: boolean;
  autoCollapse?: boolean;
  maxDepth?: number;
  className?: string;
}

export default function TableOfContents({
  articleRef,
  variant = 'sidebar',
  showProgress = true,
  autoCollapse = true,
  maxDepth = 3,
  className = ''
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [readingProgress, setReadingProgress] = useState<Record<string, boolean>>({});
  const tocRef = useRef<HTMLDivElement>(null);

  // Generate table of contents from article headings
  useEffect(() => {
    if (!articleRef.current) return;

    const generateTOC = () => {
      const headings = articleRef.current!.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TableOfContentsItem[] = [];

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > maxDepth) return;

        const text = heading.textContent || '';
        const slug = `heading-${index}-${text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}`;
        
        // Add ID to heading for navigation
        heading.id = slug;

        items.push({
          id: slug,
          text: text,
          level: level,
          slug: slug,
          isActive: false
        });
      });

      setTocItems(items);
    };

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(generateTOC);
    observer.observe(articleRef.current, { 
      childList: true, 
      subtree: true 
    });

    // Initial generation
    generateTOC();

    return () => observer.disconnect();
  }, [articleRef, maxDepth]);

  // Track active section and reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current || tocItems.length === 0) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentActive = '';
      const newProgress = { ...readingProgress };

      // Find the currently active section
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActive = tocItems[i].id;
          
          // Mark sections above as read
          for (let j = 0; j <= i; j++) {
            newProgress[tocItems[j].id] = true;
          }
          break;
        }
      }

      setActiveSection(currentActive);
      setReadingProgress(newProgress);
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [tocItems, readingProgress]);

  // Navigate to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for fixed headers
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Update active section immediately for better UX
      setActiveSection(sectionId);
    }
  };

  // Calculate reading progress percentage
  const progressPercentage = tocItems.length > 0 
    ? (Object.keys(readingProgress).length / tocItems.length) * 100 
    : 0;

  if (tocItems.length === 0) {
    return null;
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <Card className={`sticky top-8 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <List className="w-5 h-5" />
            <span>本文目錄</span>
            {showProgress && (
              <Badge variant="secondary" className="text-xs ml-auto">
                {Math.round(progressPercentage)}%
              </Badge>
            )}
          </CardTitle>
          
          {showProgress && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <TOCList 
              items={tocItems}
              activeSection={activeSection}
              readingProgress={readingProgress}
              onItemClick={scrollToSection}
              variant="sidebar"
            />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <Card className={`fixed right-4 top-1/2 -translate-y-1/2 z-30 w-64 max-h-[60vh] ${className} hidden xl:block`}>
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto"
            >
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">目錄</span>
              </div>
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Separator />
            <ScrollArea className="max-h-80 p-4">
              <TOCList 
                items={tocItems}
                activeSection={activeSection}
                readingProgress={readingProgress}
                onItemClick={scrollToSection}
                variant="floating"
              />
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  // Mobile variant (bottom sheet style)
  if (variant === 'mobile') {
    return (
      <Card className={`fixed bottom-0 left-0 right-0 z-40 rounded-t-lg border-x-0 border-b-0 ${className} lg:hidden`}>
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto rounded-none"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">文章目錄</span>
                {showProgress && (
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(progressPercentage)}%
                  </Badge>
                )}
              </div>
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <ScrollArea className="max-h-60 p-4">
              <TOCList 
                items={tocItems}
                activeSection={activeSection}
                readingProgress={readingProgress}
                onItemClick={(sectionId) => {
                  scrollToSection(sectionId);
                  setIsCollapsed(true);
                }}
                variant="mobile"
              />
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  // Inline variant
  return (
    <div className={`border rounded-lg p-4 bg-muted/30 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <List className="w-5 h-5" />
        <span className="font-semibold">文章目錄</span>
      </div>
      
      <TOCList 
        items={tocItems}
        activeSection={activeSection}
        readingProgress={readingProgress}
        onItemClick={scrollToSection}
        variant="inline"
      />
    </div>
  );
}

// Table of Contents List Component
function TOCList({
  items,
  activeSection,
  readingProgress,
  onItemClick,
  variant
}: {
  items: TableOfContentsItem[];
  activeSection: string;
  readingProgress: Record<string, boolean>;
  onItemClick: (sectionId: string) => void;
  variant: string;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item, index) => (
        <TOCItem
          key={item.id}
          item={item}
          isActive={item.id === activeSection}
          isRead={readingProgress[item.id]}
          onClick={() => onItemClick(item.id)}
          variant={variant}
        />
      ))}
    </nav>
  );
}

// Individual Table of Contents Item
function TOCItem({
  item,
  isActive,
  isRead,
  onClick,
  variant
}: {
  item: TableOfContentsItem;
  isActive: boolean;
  isRead: boolean;
  onClick: () => void;
  variant: string;
}) {
  const paddingLeft = {
    1: 'pl-0',
    2: 'pl-4',
    3: 'pl-8',
    4: 'pl-12',
    5: 'pl-16',
    6: 'pl-20'
  }[item.level] || 'pl-0';

  const textSize = {
    1: 'text-base font-semibold',
    2: 'text-sm font-medium',
    3: 'text-sm',
    4: 'text-xs',
    5: 'text-xs',
    6: 'text-xs'
  }[item.level] || 'text-sm';

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left px-3 py-2 rounded-md transition-all duration-200 hover:bg-muted/50 ${
        isActive 
          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
          : 'text-muted-foreground hover:text-foreground'
      } ${paddingLeft}`}
    >
      <div className="flex items-center space-x-2">
        <div className={`flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
          isRead 
            ? 'bg-green-500' 
            : isActive 
              ? 'bg-primary' 
              : 'bg-muted-foreground/30'
        }`} />
        
        <span className={`${textSize} line-clamp-2 group-hover:text-primary transition-colors`}>
          {item.text}
        </span>
        
        {isActive && variant !== 'mobile' && (
          <Hash className="w-3 h-3 flex-shrink-0 opacity-50" />
        )}
      </div>
    </button>
  );
}

// Compact TOC for article headers
export function CompactTableOfContents({
  items,
  className = ''
}: {
  items: TableOfContentsItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`border rounded-lg p-3 bg-muted/20 ${className}`}>
      <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        快速導覽
      </div>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 6).map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => {
              const element = document.getElementById(item.id);
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="h-7 text-xs hover:bg-primary hover:text-primary-foreground"
          >
            {item.text.length > 20 ? `${item.text.substring(0, 20)}...` : item.text}
          </Button>
        ))}
      </div>
    </div>
  );
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