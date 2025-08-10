/**
 * Blog Component Library Specifications
 * 
 * This file contains TypeScript interfaces and example component structures
 * for the MovieBonus blog feature implementation.
 */

import { ReactNode } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: Category;
  author: Author;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number;
  viewCount?: number;
  featured?: boolean;
  relatedMovies?: string[]; // Movie IDs
  relatedPromotions?: string[]; // Promotion IDs
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
  };
}

// ============================================================================
// Blog Homepage Components
// ============================================================================

/**
 * Hero Carousel Component
 * Displays featured blog posts in a carousel format
 */
export interface HeroCarouselProps {
  posts: BlogPost[];
  autoPlayInterval?: number; // milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

/**
 * Category Navigation Component
 * Shows category cards for quick navigation
 */
export interface CategoryNavProps {
  categories: Category[];
  columns?: 3 | 4 | 5 | 6;
  showPostCount?: boolean;
  className?: string;
}

/**
 * Blog Post Card Component
 * Individual post preview card for grids and lists
 */
export interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showViewCount?: boolean;
  imagePosition?: 'top' | 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

/**
 * Popular Posts Widget
 * Sidebar widget showing trending posts
 */
export interface PopularPostsWidgetProps {
  posts: BlogPost[];
  limit?: number;
  showViewCount?: boolean;
  showThumbnail?: boolean;
  title?: string;
  className?: string;
}

/**
 * Tag Cloud Component
 * Display trending tags with size variation
 */
export interface TagCloudProps {
  tags: Array<{
    name: string;
    count: number;
    url?: string;
  }>;
  maxSize?: number;
  minSize?: number;
  colorScheme?: 'monochrome' | 'gradient' | 'category';
  className?: string;
}

// ============================================================================
// Individual Post Page Components
// ============================================================================

/**
 * Reading Progress Bar
 * Shows article reading progress
 */
export interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
  position?: 'top' | 'bottom';
  height?: number;
  color?: string;
  showPercentage?: boolean;
  hideOnComplete?: boolean;
  className?: string;
}

/**
 * Table of Contents Component
 * Dynamic TOC based on article headings
 */
export interface TableOfContentsProps {
  articleRef: React.RefObject<HTMLElement>;
  headingLevels?: number[]; // e.g., [2, 3] for h2 and h3
  sticky?: boolean;
  smoothScroll?: boolean;
  highlightActive?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  title?: string;
  className?: string;
}

/**
 * Social Share Buttons
 * Sharing options for Taiwan market
 */
export interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  platforms?: Array<'line' | 'facebook' | 'twitter' | 'whatsapp' | 'telegram' | 'copy'>;
  layout?: 'horizontal' | 'vertical' | 'floating';
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Author Bio Component
 * Display author information
 */
export interface AuthorBioProps {
  author: Author;
  showAvatar?: boolean;
  showSocial?: boolean;
  showPostCount?: boolean;
  variant?: 'inline' | 'card' | 'detailed';
  className?: string;
}

/**
 * Related Posts Component
 * Show related articles
 */
export interface RelatedPostsProps {
  posts: BlogPost[];
  title?: string;
  layout?: 'grid' | 'list' | 'carousel';
  columns?: 2 | 3 | 4;
  limit?: number;
  className?: string;
}

/**
 * Movie Reference Card
 * Embed movie information within articles
 */
export interface MovieReferenceCardProps {
  movieId: string;
  showPoster?: boolean;
  showRating?: boolean;
  showBonuses?: boolean;
  showShowtimes?: boolean;
  variant?: 'inline' | 'sidebar' | 'full';
  className?: string;
}

// ============================================================================
// Archive & Category Pages Components
// ============================================================================

/**
 * Category Header Component
 * Display category information and stats
 */
export interface CategoryHeaderProps {
  category: Category;
  showDescription?: boolean;
  showPostCount?: boolean;
  showSubscribe?: boolean;
  className?: string;
}

/**
 * Post Filter Component
 * Advanced filtering options for posts
 */
export interface PostFilterProps {
  categories?: Category[];
  tags?: string[];
  authors?: Author[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sortOptions?: Array<{
    value: string;
    label: string;
  }>;
  onFilterChange?: (filters: any) => void;
  className?: string;
}

/**
 * Post Grid Component
 * Responsive grid layout for posts
 */
export interface PostGridProps {
  posts: BlogPost[];
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4 | 5;
  };
  gap?: 'sm' | 'md' | 'lg';
  loadMore?: {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
  };
  emptyState?: ReactNode;
  className?: string;
}

/**
 * Search Bar Component
 * Blog-specific search with suggestions
 */
export interface BlogSearchBarProps {
  placeholder?: string;
  suggestions?: Array<{
    type: 'post' | 'category' | 'tag' | 'author';
    label: string;
    value: string;
  }>;
  recentSearches?: string[];
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  className?: string;
}

// ============================================================================
// Mobile-Specific Components
// ============================================================================

/**
 * Mobile Bottom Navigation
 * Fixed bottom navigation for mobile
 */
export interface MobileBottomNavProps {
  items: Array<{
    icon: ReactNode;
    label: string;
    href: string;
    badge?: number;
  }>;
  activeItem?: string;
  className?: string;
}

/**
 * Pull to Refresh Component
 * Mobile gesture for refreshing content
 */
export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Bottom Sheet Component
 * Mobile-optimized modal
 */
export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  snapPoints?: number[];
  children: ReactNode;
  className?: string;
}

// ============================================================================
// SEO & Meta Components
// ============================================================================

/**
 * Blog Meta Tags Component
 * SEO optimization for blog pages
 */
export interface BlogMetaTagsProps {
  post?: BlogPost;
  category?: Category;
  type: 'article' | 'category' | 'archive' | 'home';
  canonicalUrl: string;
  ogImage?: string;
  twitterHandle?: string;
}

/**
 * Structured Data Component
 * JSON-LD for rich snippets
 */
export interface StructuredDataProps {
  type: 'Article' | 'BlogPosting' | 'NewsArticle';
  data: {
    headline: string;
    description: string;
    image: string | string[];
    datePublished: string;
    dateModified?: string;
    author: {
      name: string;
      url?: string;
    };
    publisher: {
      name: string;
      logo: string;
    };
    mainEntityOfPage?: string;
  };
}

// ============================================================================
// Utility Components
// ============================================================================

/**
 * Newsletter Signup Component
 * Email subscription form
 */
export interface NewsletterSignupProps {
  title?: string;
  description?: string;
  variant?: 'inline' | 'modal' | 'slide-in';
  incentive?: string;
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
}

/**
 * Comment Section Component
 * User comments and discussions
 */
export interface CommentSectionProps {
  postId: string;
  provider?: 'native' | 'disqus' | 'facebook';
  sortBy?: 'newest' | 'oldest' | 'popular';
  showReplies?: boolean;
  requireAuth?: boolean;
  className?: string;
}

/**
 * Breadcrumb Component
 * Navigation path indicator
 */
export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: ReactNode;
  showHome?: boolean;
  className?: string;
}

/**
 * Reading Time Estimator
 * Calculate and display reading time
 */
export interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  showIcon?: boolean;
  format?: 'short' | 'long';
  className?: string;
}

// ============================================================================
// Animation & Interaction Hooks
// ============================================================================

/**
 * Use Intersection Observer Hook
 * For lazy loading and animations
 */
export interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Use Reading Progress Hook
 * Track reading progress
 */
export interface UseReadingProgressProps {
  targetRef: React.RefObject<HTMLElement>;
  throttleMs?: number;
}

/**
 * Use Share Hook
 * Handle social sharing logic
 */
export interface UseShareProps {
  url: string;
  title: string;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Theme & Styling Constants
// ============================================================================

export const blogTheme = {
  colors: {
    categories: {
      news: 'hsl(var(--info))',
      bonus: 'hsl(var(--warning))',
      theater: 'hsl(var(--secondary))',
      review: 'hsl(var(--success))',
      boxoffice: 'hsl(var(--primary))',
    },
  },
  typography: {
    article: {
      fontFamily: "'Noto Sans TC', sans-serif",
      fontSize: {
        desktop: '18px',
        mobile: '16px',
      },
      lineHeight: {
        desktop: 1.8,
        mobile: 1.75,
      },
      letterSpacing: '0.05em',
    },
    heading: {
      fontFamily: "'Noto Serif TC', serif",
      fontWeight: 600,
    },
  },
  spacing: {
    articlePadding: {
      desktop: '60px',
      tablet: '40px',
      mobile: '20px',
    },
    sectionGap: '48px',
    paragraphGap: '24px',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

// ============================================================================
// Sample Component Implementation
// ============================================================================

/**
 * Example implementation of BlogPostCard component
 * This demonstrates how the actual component should be structured
 */
export const BlogPostCardExample = `
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, User } from 'lucide-react';
import { MovieImage } from '@/components/MovieImage';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showReadingTime = true,
  showViewCount = false,
  imagePosition = 'top',
  className,
  onClick,
}) => {
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
    locale: zhTW,
  });

  const cardContent = (
    <Card className={\`overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary \${className}\`}>
      <CardContent className="p-0">
        {imagePosition === 'top' && (
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
        )}
        
        <div className="p-6">
          <h3 className="font-headline text-xl font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          {showExcerpt && (
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {showAuthor && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
            )}
            
            {showReadingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} 分鐘</span>
              </div>
            )}
            
            {showViewCount && post.viewCount && (
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
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {cardContent}
      </button>
    );
  }

  return (
    <Link href={\`/blog/\${post.category.slug}/\${post.slug}\`}>
      {cardContent}
    </Link>
  );
};
`;