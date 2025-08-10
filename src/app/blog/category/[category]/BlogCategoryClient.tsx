/**
 * BlogCategoryClient Component
 * 
 * Client-side category archive page with filtering,
 * search within category, and pagination
 */

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, SortAsc, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BlogLayout from '@/components/blog/BlogLayout';
import PostCard from '@/components/blog/PostCard';
import { SearchBarCompact } from '@/components/blog/SearchBar';
import { BlogPost, BlogCategory } from '@/lib/types';

interface BlogCategoryClientProps {
  category: BlogCategory & { posts?: BlogPost[] };
  posts: BlogPost[];
  pagination: {
    current_page: number;
    total_pages?: number;
    has_more: boolean;
  };
  searchParams: {
    search?: string;
    tag?: string;
    sort?: string;
    page: number;
  };
}

export default function BlogCategoryClient({
  category,
  posts,
  pagination,
  searchParams
}: BlogCategoryClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState(searchParams.search || '');

  // Generate breadcrumbs
  const breadcrumbs = [
    { label: '首頁', href: '/' },
    { label: '部落格', href: '/blog' },
    { label: '分類', href: '/blog' },
    { label: category.name }
  ];

  // Handle search within category
  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (searchParams.tag) params.set('tag', searchParams.tag);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    
    const newUrl = `/blog/category/${category.slug}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.tag) params.set('tag', searchParams.tag);
    params.set('sort', sort);
    
    const newUrl = `/blog/category/${category.slug}?${params.toString()}`;
    router.push(newUrl);
  };

  // Handle tag filter
  const handleTagFilter = (tag: string) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    if (tag) params.set('tag', tag);
    
    const newUrl = `/blog/category/${category.slug}?${params.toString()}`;
    router.push(newUrl);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(`/blog/category/${category.slug}`);
  };

  // Generate pagination URLs
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.tag) params.set('tag', searchParams.tag);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    if (page > 1) params.set('page', page.toString());
    
    return `/blog/category/${category.slug}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // Get category icon
  const getCategoryIcon = (slug: string) => {
    const icons = {
      'news': '🎬',
      'bonus': '🎁', 
      'theater': '🏢',
      'review': '⭐',
      'boxoffice': '📈'
    };
    return icons[slug as keyof typeof icons] || '📝';
  };

  return (
    <BlogLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Category Header */}
        <section className="text-center py-8 bg-muted/30 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">{getCategoryIcon(category.slug)}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-muted-foreground mb-4">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>共 {posts.length} 篇文章</span>
              <Separator orientation="vertical" className="h-4" />
              <span>持續更新中</span>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder={`在 ${category.name} 中搜尋...`}
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(localSearch);
                        }
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3">
                  {/* Sort */}
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

                  {/* View Mode Toggle */}
                  <div className="flex rounded-md border">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {(searchParams.search || searchParams.tag) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                    >
                      清除篩選
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(searchParams.search || searchParams.tag) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {searchParams.search && (
                    <Badge variant="secondary">
                      搜尋: {searchParams.search}
                    </Badge>
                  )}
                  {searchParams.tag && (
                    <Badge variant="secondary">
                      標籤: #{searchParams.tag}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Posts Grid/List */}
        <section>
          {posts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
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
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      variant="default"
                      showImage={true}
                      showExcerpt={true}
                      showMeta={true}
                      className="md:flex md:space-x-6"
                    />
                  ))}
                </div>
              )}

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
            <NoPostsFound 
              category={category}
              hasFilters={Boolean(searchParams.search || searchParams.tag)}
            />
          )}
        </section>

        {/* Related Categories */}
        <section>
          <RelatedCategories currentCategory={category} />
        </section>
      </div>
    </BlogLayout>
  );
}

// No Posts Found Component
function NoPostsFound({ 
  category, 
  hasFilters 
}: { 
  category: BlogCategory; 
  hasFilters: boolean; 
}) {
  return (
    <Card>
      <CardContent className="text-center py-16">
        <div className="text-6xl mb-6">😔</div>
        <h3 className="text-xl font-semibold mb-4">
          {hasFilters ? '找不到相關文章' : `${category.name} 暫無文章`}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {hasFilters 
            ? '請嘗試調整搜尋條件或篩選條件，或許能找到您想要的內容。'
            : `我們正在努力為 ${category.name} 分類準備精彩內容，請稍後再來查看。`
          }
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

// Related Categories Component
function RelatedCategories({ currentCategory }: { currentCategory: BlogCategory }) {
  // Mock related categories - in real app, this would come from props or API
  const relatedCategories = [
    { name: '新片速報', slug: 'news', description: '最新上映電影資訊' },
    { name: '特典情報', slug: 'bonus', description: '限定禮品與優惠' },
    { name: '觀影推薦', slug: 'review', description: '精選電影評論' }
  ].filter(cat => cat.slug !== currentCategory.slug);

  if (relatedCategories.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">其他分類</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedCategories.map((category) => (
            <Link 
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="block p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <h4 className="font-semibold mb-2">{category.name}</h4>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}