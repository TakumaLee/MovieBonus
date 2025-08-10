/**
 * BlogTagClient Component
 * 
 * Client-side tag archive page with related tags,
 * sorting options, and pagination
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag, Hash, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BlogLayout from '@/components/blog/BlogLayout';
import PostCard from '@/components/blog/PostCard';
import { BlogPost } from '@/lib/types';

interface BlogTagClientProps {
  tag: string;
  posts: BlogPost[];
  pagination: {
    current_page: number;
    total_pages?: number;
    has_more: boolean;
  };
  searchParams: {
    sort?: string;
    page: number;
  };
}

export default function BlogTagClient({
  tag,
  posts,
  pagination,
  searchParams
}: BlogTagClientProps) {
  const router = useRouter();

  // Generate breadcrumbs
  const breadcrumbs = [
    { label: '首頁', href: '/' },
    { label: '部落格', href: '/blog' },
    { label: '標籤', href: '/blog' },
    { label: `#${tag}` }
  ];

  // Handle sort change
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams();
    params.set('sort', sort);
    
    const newUrl = `/blog/tag/${encodeURIComponent(tag)}?${params.toString()}`;
    router.push(newUrl);
  };

  // Generate pagination URLs
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.sort) params.set('sort', searchParams.sort);
    if (page > 1) params.set('page', page.toString());
    
    return `/blog/tag/${encodeURIComponent(tag)}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // Get related tags from posts
  const relatedTags = React.useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    posts.forEach(post => {
      post.tags.forEach(postTag => {
        if (postTag !== tag) {
          tagCounts.set(postTag, (tagCounts.get(postTag) || 0) + 1);
        }
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tagName, count]) => ({ name: tagName, count }));
  }, [posts, tag]);

  return (
    <BlogLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Tag Header */}
        <section className="text-center py-8 bg-muted/30 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Hash className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              #{tag}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              探索標籤為「{tag}」的所有相關文章
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>共 {posts.length} 篇文章</span>
              <Separator orientation="vertical" className="h-4" />
              <span>按相關性排序</span>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">標籤文章</span>
                  <Badge variant="secondary">{posts.length} 篇</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Select value={searchParams.sort || 'newest'} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">最新發布</SelectItem>
                      <SelectItem value="oldest">最早發布</SelectItem>
                      <SelectItem value="popular">最多瀏覽</SelectItem>
                      <SelectItem value="trending">熱門文章</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" asChild>
                    <Link href="/blog/search">
                      搜尋其他標籤
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Posts Grid */}
        <section>
          {posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
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

              {/* Pagination */}
              {(pagination.current_page > 1 || pagination.has_more) && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  {/* Previous Page */}
                  {pagination.current_page > 1 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={generatePageUrl(pagination.current_page - 1)}>
                        <ChevronLeft className="w-4 h-4" />
                        上一頁
                      </Link>
                    </Button>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.total_pages || 5) }, (_, i) => {
                      const pageNum = Math.max(1, pagination.current_page - 2) + i;
                      const isActive = pageNum === pagination.current_page;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className="w-10"
                          asChild={!isActive}
                        >
                          {isActive ? (
                            <span>{pageNum}</span>
                          ) : (
                            <Link href={generatePageUrl(pageNum)}>
                              {pageNum}
                            </Link>
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  {pagination.has_more && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={generatePageUrl(pagination.current_page + 1)}>
                        下一頁
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <NoPostsFound tag={tag} />
          )}
        </section>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>相關標籤</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map(({ name, count }) => (
                    <Link
                      key={name}
                      href={`/blog/tag/${encodeURIComponent(name)}`}
                      className="group"
                    >
                      <Badge 
                        variant="outline" 
                        className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        #{name}
                        <span className="ml-1 text-xs opacity-70">({count})</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Tag Actions */}
        <section>
          <TagActions tag={tag} postCount={posts.length} />
        </section>
      </div>
    </BlogLayout>
  );
}

// No Posts Found Component
function NoPostsFound({ tag }: { tag: string }) {
  return (
    <Card>
      <CardContent className="text-center py-16">
        <div className="text-6xl mb-6">🏷️</div>
        <h3 className="text-xl font-semibold mb-4">
          找不到標籤「{tag}」的文章
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          此標籤可能已不存在，或者相關文章已被移除。
          您可以搜尋其他相關標籤或瀏覽所有文章。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/blog">
              瀏覽所有文章
            </Link>
          </Button>
          <Button asChild>
            <Link href="/blog/search">
              搜尋其他內容
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Tag Actions Component
function TagActions({ tag, postCount }: { tag: string; postCount: number }) {
  const encodedTag = encodeURIComponent(tag);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">標籤資訊</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">標籤統計</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">文章數量:</span>
                <span className="font-medium">{postCount} 篇</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">標籤名稱:</span>
                <span className="font-medium">#{tag}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">快速操作</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                asChild
              >
                <Link href={`/blog/search?q=${encodedTag}`}>
                  <Hash className="w-4 h-4 mr-2" />
                  搜尋「{tag}」
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/blog/tag/${encodedTag}`;
                  navigator.clipboard.writeText(shareUrl);
                  // You could show a toast here
                }}
              >
                <Tag className="w-4 h-4 mr-2" />
                分享標籤頁面
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}