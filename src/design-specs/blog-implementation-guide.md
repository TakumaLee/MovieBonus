# Blog Feature Implementation Guide

## Quick Start for Developers

This guide provides step-by-step instructions for implementing the MovieBonus blog feature based on the UI/UX designs.

## 1. Project Structure

```
frontend/MovieBonus/src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                 # Blog homepage
│   │   ├── [category]/
│   │   │   ├── page.tsx             # Category archive
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Individual post
│   │   └── layout.tsx               # Blog layout wrapper
│   └── api/
│       └── blog/
│           ├── posts/route.ts       # Posts API
│           └── categories/route.ts  # Categories API
├── components/
│   └── blog/
│       ├── BlogPostCard.tsx
│       ├── HeroCarousel.tsx
│       ├── CategoryNav.tsx
│       ├── TableOfContents.tsx
│       ├── ReadingProgress.tsx
│       ├── SocialShare.tsx
│       ├── AuthorBio.tsx
│       ├── RelatedPosts.tsx
│       ├── PopularPosts.tsx
│       ├── TagCloud.tsx
│       └── MobileBottomNav.tsx
├── hooks/
│   └── blog/
│       ├── useBlogPosts.ts
│       ├── useReadingProgress.ts
│       ├── useTableOfContents.ts
│       └── useShare.ts
└── lib/
    └── blog/
        ├── types.ts
        ├── api.ts
        └── utils.ts
```

## 2. Database Schema

```sql
-- Blog Categories
CREATE TABLE blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    category_id UUID REFERENCES blog_categories(id),
    author_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    featured BOOLEAN DEFAULT FALSE,
    reading_time INTEGER, -- in minutes
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- SEO fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image VARCHAR(500),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('chinese', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('chinese', coalesce(excerpt, '')), 'B') ||
        setweight(to_tsvector('chinese', coalesce(content, '')), 'C')
    ) STORED
);

-- Blog Tags
CREATE TABLE blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Tags Junction
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Post Movies Junction (relate posts to movies)
CREATE TABLE blog_post_movies (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, movie_id)
);

-- Post Promotions Junction (relate posts to promotions)
CREATE TABLE blog_post_promotions (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, promotion_id)
);

-- Indexes for performance
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
```

## 3. API Endpoints

### Blog Posts API
```typescript
// GET /api/blog/posts
interface GetPostsParams {
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: 'latest' | 'popular' | 'trending';
}

// GET /api/blog/posts/[slug]
interface GetPostResponse {
  post: BlogPost;
  related: BlogPost[];
}

// POST /api/blog/posts/[slug]/view
// Increment view count

// GET /api/blog/posts/search
interface SearchParams {
  q: string;
  category?: string;
  limit?: number;
}
```

### Categories API
```typescript
// GET /api/blog/categories
interface GetCategoriesResponse {
  categories: Category[];
}

// GET /api/blog/categories/[slug]
interface GetCategoryResponse {
  category: Category;
  posts: BlogPost[];
}
```

## 4. Key Component Implementations

### Blog Post Card
```tsx
// components/blog/BlogPostCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { MovieImage } from '@/components/MovieImage';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const BlogPostCard = ({ post, variant = 'default' }) => {
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: zhTW,
  });

  return (
    <Link href={`/blog/${post.category.slug}/${post.slug}`}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <MovieImage
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge 
              className="absolute top-3 left-3"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          </div>
          
          <div className="p-6">
            <h3 className="font-headline text-xl font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} 分鐘</span>
              </div>
              
              {post.viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount.toLocaleString()}</span>
                </div>
              )}
              
              <span className="ml-auto">{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
```

### Reading Progress Hook
```typescript
// hooks/blog/useReadingProgress.ts
import { useState, useEffect, useCallback } from 'react';

export const useReadingProgress = (targetRef: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    if (!targetRef.current) return;

    const element = targetRef.current;
    const totalHeight = element.clientHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const elementTop = element.offsetTop;
    const elementBottom = elementTop + totalHeight;

    if (scrollTop >= elementBottom - windowHeight) {
      setProgress(100);
    } else if (scrollTop <= elementTop) {
      setProgress(0);
    } else {
      const scrollDistance = scrollTop - elementTop + windowHeight;
      const readableDistance = totalHeight;
      const progressPercentage = (scrollDistance / readableDistance) * 100;
      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    }
  }, [targetRef]);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateProgress]);

  return progress;
};
```

### Table of Contents Component
```tsx
// components/blog/TableOfContents.tsx
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = ({ articleRef, className }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!articleRef.current) return;

    const elements = articleRef.current.querySelectorAll('h2, h3');
    const headingData = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.charAt(1)),
    }));

    setHeadings(headingData);
  }, [articleRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    const elements = articleRef.current?.querySelectorAll('h2, h3');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [articleRef, headings]);

  return (
    <nav className={cn('sticky top-20', className)}>
      <h3 className="font-semibold mb-4">本文目錄</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              'border-l-2 transition-all',
              heading.level === 3 && 'ml-4',
              activeId === heading.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <a
              href={`#${heading.id}`}
              className="block py-1 pl-4 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

### Social Share Component (Taiwan-optimized)
```tsx
// components/blog/SocialShare.tsx
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const SocialShare = ({ url, title, description }) => {
  const { toast } = useToast();

  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(lineUrl, '_blank', 'width=600,height=500');
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=500');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: '連結已複製',
        description: '文章連結已複製到剪貼簿',
      });
    } catch (err) {
      toast({
        title: '複製失敗',
        description: '請手動複製連結',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={shareToLine}
        className="bg-[#00C300] hover:bg-[#00B300] text-white"
        size="lg"
      >
        LINE
      </Button>
      <Button
        onClick={shareToFacebook}
        className="bg-[#1877F2] hover:bg-[#1865D2] text-white"
        size="icon"
      >
        f
      </Button>
      <Button
        onClick={shareToTwitter}
        className="bg-[#1DA1F2] hover:bg-[#1A91E2] text-white"
        size="icon"
      >
        𝕏
      </Button>
      <Button
        onClick={copyLink}
        variant="outline"
        size="icon"
      >
        📋
      </Button>
    </div>
  );
};
```

## 5. SEO Implementation

### Blog Post Head Tags
```tsx
// app/blog/[category]/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.ogImage || post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage || post.coverImage],
    },
    alternates: {
      canonical: `/blog/${post.category.slug}/${post.slug}`,
    },
  };
}
```

### Structured Data
```tsx
// components/blog/BlogStructuredData.tsx
export const BlogStructuredData = ({ post }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'MovieBonus 編輯部',
      url: 'https://moviebonus.tw',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MovieBonus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://moviebonus.tw/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://moviebonus.tw/blog/${post.category.slug}/${post.slug}`,
    },
    articleBody: post.content,
    keywords: post.tags.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
```

## 6. Performance Optimizations

### Image Optimization
```tsx
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Lazy Loading Posts
```tsx
// hooks/blog/useBlogPosts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useBlogPosts = (category?: string) => {
  return useInfiniteQuery({
    queryKey: ['blog-posts', category],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/api/blog/posts?offset=${pageParam}&limit=12${
          category ? `&category=${category}` : ''
        }`
      );
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts.length < 12) return undefined;
      return pages.length * 12;
    },
  });
};
```

## 7. Mobile Optimizations

### Touch Gestures
```tsx
// components/blog/HeroCarousel.tsx
import { useSwipeable } from 'react-swipeable';

export const HeroCarousel = ({ posts }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="relative">
      {/* Carousel content */}
    </div>
  );
};
```

### Mobile Bottom Navigation
```tsx
// components/blog/MobileBottomNav.tsx
import { Home, Search, Bookmark, Menu, Grid3x3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: '首頁' },
    { href: '/blog/categories', icon: Grid3x3, label: '分類' },
    { href: '/blog/search', icon: Search, label: '搜尋' },
    { href: '/blog/saved', icon: Bookmark, label: '收藏' },
    { href: '/menu', icon: Menu, label: '更多' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center p-2',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

## 8. Testing Checklist

### Accessibility
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### SEO
- [ ] Meta tags present
- [ ] Structured data validates
- [ ] Sitemap includes blog posts
- [ ] Canonical URLs set
- [ ] Open Graph tags work

### Performance
- [ ] Images lazy load
- [ ] First paint < 1.5s
- [ ] TTI < 3.5s
- [ ] Bundle size optimized
- [ ] API responses cached

### Mobile
- [ ] Touch targets >= 48px
- [ ] Swipe gestures work
- [ ] Bottom nav accessible
- [ ] Text readable without zoom
- [ ] Viewport configured

### Taiwan Market
- [ ] LINE sharing works
- [ ] Chinese text renders correctly
- [ ] Date/time in local format
- [ ] Traditional Chinese used
- [ ] Local social platforms integrated

## 9. Launch Checklist

1. **Content Migration**
   - [ ] Import existing articles
   - [ ] Set up categories
   - [ ] Configure authors
   - [ ] Add initial tags

2. **SEO Setup**
   - [ ] Submit sitemap to Google
   - [ ] Configure robots.txt
   - [ ] Set up Google Analytics
   - [ ] Install Search Console

3. **Performance**
   - [ ] Enable CDN
   - [ ] Configure caching
   - [ ] Optimize images
   - [ ] Minify assets

4. **Monitoring**
   - [ ] Set up error tracking
   - [ ] Configure uptime monitoring
   - [ ] Enable performance monitoring
   - [ ] Set up analytics events

5. **Content Strategy**
   - [ ] Editorial calendar created
   - [ ] Content guidelines documented
   - [ ] Publishing workflow defined
   - [ ] Social media strategy planned