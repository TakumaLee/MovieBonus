/**
 * PostCard Component
 * 
 * Reusable blog post card component for displaying post previews
 * in grids, lists, and carousels with optimized loading
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Heart, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/blog-api-client';

interface PostCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showImage?: boolean;
  showExcerpt?: boolean;
  showMeta?: boolean;
  className?: string;
}

export default function PostCard({
  post,
  variant = 'default',
  showImage = true,
  showExcerpt = true,
  showMeta = true,
  className = ''
}: PostCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const cardStyles = {
    default: 'h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]',
    featured: 'h-full bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]',
    compact: 'h-full hover:shadow-md transition-all duration-200',
    minimal: 'h-full border-none shadow-none hover:bg-muted/50 transition-colors'
  };

  const imageAspectRatio = variant === 'featured' ? 'aspect-[16/10]' : 'aspect-[16/9]';

  return (
    <Card className={`${cardStyles[variant]} ${className}`}>
      {/* Featured Badge */}
      {post.is_featured && variant !== 'featured' && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            精選
          </Badge>
        </div>
      )}

      {/* Post Image */}
      {showImage && post.cover_image && (
        <div className={`relative overflow-hidden ${variant === 'minimal' ? 'rounded-t-lg' : ''}`}>
          <Link href={`/blog/${post.slug}`} className="block">
            <div className={`relative ${imageAspectRatio} w-full overflow-hidden bg-muted`}>
              {imageLoading && !imageError && (
                <Skeleton className="absolute inset-0" />
              )}
              
              {!imageError ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className={`object-cover transition-transform duration-500 hover:scale-110 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={post.is_featured}
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">無法載入圖片</div>
                </div>
              )}

              {/* Category Badge on Image */}
              {post.category && variant !== 'minimal' && (
                <div className="absolute top-3 left-3">
                  <CategoryBadge category={post.category} />
                </div>
              )}

              {/* Reading Time Badge */}
              {post.reading_time && variant === 'featured' && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white border-none">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.reading_time} 分鐘
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Card Content */}
      <div className={variant === 'featured' ? 'p-6' : 'p-4'}>
        {/* Category Badge (when no image) */}
        {(!showImage || !post.cover_image) && post.category && (
          <div className="mb-3">
            <CategoryBadge category={post.category} />
          </div>
        )}

        {/* Post Title */}
        <CardHeader className="p-0 mb-3">
          <Link href={`/blog/${post.slug}`}>
            <h3 className={`font-bold leading-tight hover:text-primary transition-colors ${
              variant === 'featured' 
                ? 'text-xl md:text-2xl' 
                : variant === 'compact' 
                  ? 'text-base'
                  : 'text-lg'
            } ${variant === 'minimal' ? 'text-sm' : ''}`}>
              {post.title}
            </h3>
          </Link>
        </CardHeader>

        {/* Post Excerpt */}
        {showExcerpt && post.excerpt && variant !== 'minimal' && (
          <CardContent className="p-0 mb-4">
            <p className={`text-muted-foreground leading-relaxed ${
              variant === 'featured' ? 'text-base' : 'text-sm'
            } line-clamp-3`}>
              {post.excerpt}
            </p>
          </CardContent>
        )}

        {/* Post Meta */}
        {showMeta && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              {/* Author */}
              {post.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{post.author.name}</span>
                </div>
              )}

              {/* Publish Date */}
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(post.published_at || post.created_at)}</span>
              </div>

              {/* Reading Time */}
              {post.reading_time && variant !== 'featured' && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.reading_time} 分鐘</span>
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center space-x-3">
              {/* Views */}
              {post.view_count > 0 && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatNumber(post.view_count)}</span>
                </div>
              )}

              {/* Likes */}
              {post.like_count > 0 && (
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{formatNumber(post.like_count)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags (for featured variant) */}
        {variant === 'featured' && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                  #{tag}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Category Badge Component
function CategoryBadge({ category }: { category: any }) {
  const categoryColors = {
    news: 'bg-blue-500',
    bonus: 'bg-orange-500',
    theater: 'bg-green-500',
    review: 'bg-purple-500',
    boxoffice: 'bg-red-500',
  } as const;

  const colorClass = categoryColors[category.slug as keyof typeof categoryColors] || 'bg-gray-500';

  return (
    <Link href={`/blog/category/${category.slug}`}>
      <Badge 
        variant="default" 
        className={`${colorClass} text-white border-none text-xs hover:opacity-80 transition-opacity`}
      >
        {category.name}
      </Badge>
    </Link>
  );
}

// Loading Skeleton for PostCard
export function PostCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'featured' | 'compact' | 'minimal' }) {
  const imageHeight = variant === 'featured' ? 'h-64' : variant === 'compact' ? 'h-40' : 'h-48';
  
  return (
    <Card className="h-full">
      <Skeleton className={`w-full ${imageHeight}`} />
      <div className={variant === 'featured' ? 'p-6' : 'p-4'}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className={`${variant === 'featured' ? 'h-8' : 'h-6'} w-full`} />
          {variant !== 'minimal' && <Skeleton className="h-4 w-full" />}
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Utility function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}