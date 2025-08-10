/**
 * PostContent Component
 * 
 * Full blog post content renderer with optimized typography,
 * structured content blocks, and Taiwan-specific optimizations
 */

'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Heart, Share2, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/blog-api-client';

interface PostContentProps {
  post: BlogPost;
  className?: string;
  onContentLoad?: () => void;
}

export default function PostContent({ 
  post, 
  className = '',
  onContentLoad 
}: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onContentLoad && contentRef.current) {
      // Notify parent component that content has loaded
      onContentLoad();
    }
  }, [post.content, onContentLoad]);

  return (
    <article className={`max-w-4xl mx-auto ${className}`} ref={contentRef}>
      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <Link href={`/blog/category/${post.category.slug}`}>
              <CategoryBadge category={post.category} />
            </Link>
          </div>
        )}

        {/* Article Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground">
          {post.title}
        </h1>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {/* Author */}
          {post.author && (
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                <AvatarFallback className="text-xs">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}

          <Separator orientation="vertical" className="h-4" />

          {/* Publish Date */}
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>

          {/* Reading Time */}
          {post.reading_time && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} 分鐘閱讀</span>
              </div>
            </>
          )}

          {/* View Count */}
          {post.view_count > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{formatViewCount(post.view_count)} 次瀏覽</span>
              </div>
            </>
          )}
        </div>

        {/* Article Excerpt */}
        {post.excerpt && (
          <div className="text-lg text-muted-foreground leading-relaxed mb-6 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            {post.excerpt}
          </div>
        )}

        {/* Featured Image */}
        {post.cover_image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-8">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <PostContentRenderer content={post.content} />
      </div>

      {/* Movie Cards (if related to movies) */}
      {(post.primary_movie || post.related_movies) && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6">相關電影</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {post.primary_movie && (
              <MovieCard movie={post.primary_movie} isPrimary />
            )}
            {post.related_movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">標籤</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                <Badge 
                  variant="outline" 
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article Stats */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{formatViewCount(post.view_count)}</span>
            <span className="text-sm text-muted-foreground">瀏覽</span>
          </div>
          
          {post.like_count > 0 && (
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{post.like_count}</span>
              <span className="text-sm text-muted-foreground">喜歡</span>
            </div>
          )}
          
          {post.share_count > 0 && (
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{post.share_count}</span>
              <span className="text-sm text-muted-foreground">分享</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          更新於 {formatRelativeTime(post.updated_at)}
        </div>
      </div>

      {/* Author Bio */}
      {post.author && (
        <AuthorBio author={post.author} />
      )}
    </article>
  );
}

// Content Renderer with support for different block types
function PostContentRenderer({ content }: { content: string }) {
  // Enhanced content processing for Taiwan market
  const processedContent = content
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map((paragraph, index) => {
      if (!paragraph.trim()) return null;

      // Check for special content blocks
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }

      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }

      if (paragraph.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
            {paragraph.replace('> ', '')}
          </blockquote>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-4 leading-relaxed text-foreground">
          {paragraph}
        </p>
      );
    })
    .filter(Boolean);

  return <div className="space-y-4">{processedContent}</div>;
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
    <Badge className={`${colorClass} text-white border-none hover:opacity-80 transition-opacity`}>
      {category.name}
    </Badge>
  );
}

// Movie Card Component
function MovieCard({ movie, isPrimary = false }: { movie: any; isPrimary?: boolean }) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${isPrimary ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {movie.poster_url && (
            <div className="flex-shrink-0">
              <Image
                src={movie.poster_url}
                alt={movie.title}
                width={80}
                height={120}
                className="rounded-md object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-lg truncate">{movie.title}</h4>
              {isPrimary && (
                <Badge variant="default" className="text-xs">主要電影</Badge>
              )}
            </div>
            
            {movie.english_title && (
              <p className="text-sm text-muted-foreground mb-2">{movie.english_title}</p>
            )}
            
            {movie.synopsis && (
              <p className="text-sm line-clamp-3 mb-3">{movie.synopsis}</p>
            )}
            
            <div className="flex items-center justify-between">
              {movie.release_date && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(movie.release_date)}
                </span>
              )}
              
              <Link 
                href={`/movie/${movie.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                查看詳情
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Author Bio Component
function AuthorBio({ author }: { author: any }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={author.avatar_url} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-semibold text-lg">{author.name}</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>作者</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {author.bio && (
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
          
          {author.social_links && (
            <div className="flex space-x-4 mt-4">
              {author.social_links.line && (
                <a 
                  href={author.social_links.line}
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINE
                </a>
              )}
              {author.social_links.facebook && (
                <a 
                  href={author.social_links.facebook}
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              )}
              {author.social_links.twitter && (
                <a 
                  href={author.social_links.twitter}
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Utility function to format view count
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}