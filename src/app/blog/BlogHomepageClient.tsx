/**
 * BlogHomepageClient Component
 * 
 * Client-side blog homepage with hero carousel, category navigation,
 * latest posts grid, and sidebar widgets
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import BlogLayout from '@/components/blog/BlogLayout';
import PostCard from '@/components/blog/PostCard';
import CategoryNav from '@/components/blog/CategoryNav';
import PopularPosts, { PopularPostsMinimal } from '@/components/blog/PopularPosts';
import { SearchBarHero } from '@/components/blog/SearchBar';
import { BlogPost, BlogCategory, PopularPost } from '@/lib/types';
import { formatRelativeTime } from '@/lib/blog-api-client';

interface BlogHomepageClientProps {
  featuredPosts: BlogPost[];
  latestPosts: BlogPost[];
  categories: BlogCategory[];
  popularPosts: PopularPost[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    has_more: boolean;
  };
}

export default function BlogHomepageClient({
  featuredPosts,
  latestPosts,
  categories,
  popularPosts,
  pagination
}: BlogHomepageClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <BlogLayout>
      <div className="space-y-12">
        {/* Hero Search Section */}
        <section className="text-center py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                電影部落格
              </h1>
              <p className="text-xl text-muted-foreground">
                探索最新電影資訊、特典情報與觀影指南
              </p>
            </div>
            <SearchBarHero />
          </div>
        </section>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">精選文章</h2>
              <Link href="/blog?featured=true" className="text-primary hover:underline flex items-center space-x-1">
                <span>查看全部</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <FeaturedCarousel posts={featuredPosts} />
          </section>
        )}

        {/* Category Navigation */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">文章分類</h2>
          </div>
          
          <CategoryNav 
            categories={categories}
            variant="grid"
            showCounts={true}
          />
        </section>

        {/* Latest Posts with Sidebar */}
        <section>
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">最新文章</h2>
                <Link href="/blog/search?sort=newest" className="text-primary hover:underline flex items-center space-x-1">
                  <span>查看更多</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {latestPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    variant="default"
                    showImage={true}
                    showExcerpt={true}
                    showMeta={true}
                  />
                ))}
              </div>

              {/* Load More / Pagination */}
              {pagination?.has_more && (
                <div className="text-center">
                  <Button variant="outline" size="lg" asChild>
                    <Link href={`/blog?page=${Math.floor(pagination.offset / pagination.limit) + 2}`}>
                      載入更多文章
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Popular Posts */}
              <PopularPosts 
                showTabs={true}
                limit={10}
              />

              {/* Newsletter Signup */}
              <NewsletterSignup />

              {/* Quick Categories */}
              <QuickCategories categories={categories} />
            </aside>
          </div>
        </section>

        {/* Blog Statistics */}
        <section className="bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">部落格統計</h2>
            <p className="text-muted-foreground">我們的內容成長軌跡</p>
          </div>
          
          <BlogStats 
            totalPosts={latestPosts.length + featuredPosts.length}
            totalCategories={categories.length}
            totalViews={popularPosts.reduce((sum, post) => sum + post.view_count, 0)}
          />
        </section>
      </div>
    </BlogLayout>
  );
}

// Featured Posts Carousel Component
function FeaturedCarousel({ posts }: { posts: BlogPost[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {posts.map((post, index) => (
          <CarouselItem key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <Card className="relative overflow-hidden h-[400px] md:h-[500px] group cursor-pointer">
                {/* Background Image */}
                {post.cover_image && (
                  <div className="absolute inset-0">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                )}

                {/* Content Overlay */}
                <CardContent className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  {/* Category Badge */}
                  {post.category && (
                    <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground">
                      {post.category.name}
                    </Badge>
                  )}

                  {/* Featured Badge */}
                  <Badge className="absolute top-6 right-6 bg-yellow-500 text-black font-semibold">
                    精選
                  </Badge>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-lg text-gray-200 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      {post.author && (
                        <span>{post.author.name}</span>
                      )}
                      
                      <Separator orientation="vertical" className="h-4" />
                      
                      <span>{formatRelativeTime(post.published_at || post.created_at)}</span>
                      
                      {post.reading_time && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.reading_time} 分鐘</span>
                          </div>
                        </>
                      )}
                      
                      {post.view_count > 0 && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.view_count} 次瀏覽</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}

// Newsletter Signup Component
function NewsletterSignup() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">訂閱電子報</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          第一時間收到最新電影資訊與特典情報
        </p>
        
        <div className="space-y-3">
          <input
            type="email"
            placeholder="請輸入您的電子郵件"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <Button className="w-full" size="sm">
            立即訂閱
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          我們重視您的隱私，絕不會濫發廣告郵件
        </p>
      </CardContent>
    </Card>
  );
}

// Quick Categories Component
function QuickCategories({ categories }: { categories: BlogCategory[] }) {
  const topCategories = categories
    .filter(cat => cat.is_active)
    .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">熱門分類</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCategories.map((category) => (
            <Link 
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
            >
              <span className="font-medium">{category.name}</span>
              {category.post_count !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {category.post_count}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Blog Statistics Component
function BlogStats({
  totalPosts,
  totalCategories,
  totalViews
}: {
  totalPosts: number;
  totalCategories: number;
  totalViews: number;
}) {
  const stats = [
    {
      label: '總文章數',
      value: totalPosts.toLocaleString(),
      description: '豐富內容'
    },
    {
      label: '分類數量',
      value: totalCategories.toString(),
      description: '多元主題'
    },
    {
      label: '總瀏覽量',
      value: totalViews.toLocaleString(),
      description: '讀者喜愛'
    },
    {
      label: '更新頻率',
      value: '每日',
      description: '持續更新'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {stat.value}
          </div>
          <div className="text-lg font-semibold mb-1">
            {stat.label}
          </div>
          <div className="text-sm text-muted-foreground">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
}