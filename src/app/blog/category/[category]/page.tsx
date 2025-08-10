/**
 * Blog Category Archive Page
 * 
 * Features:
 * - Dynamic category-based post filtering
 * - SEO optimized category pages
 * - Pagination and search within category
 * - ISR for performance
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogCategoryClient from './BlogCategoryClient';
import { 
  fetchPostsByCategory, 
  fetchCategoryWithPosts,
  fetchBlogCategories 
} from '@/lib/blog-api-client';
import { generateBlogCategoryMetadata } from '@/lib/blog-seo-utils';

interface BlogCategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
    sort?: string;
  };
}

// Enable ISR
export const revalidate = 600; // 10 minutes

export async function generateStaticParams() {
  try {
    const response = await fetchBlogCategories();
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data.map((category) => ({
      category: category.slug,
    }));
  } catch (error) {
    console.error('Error generating category static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = params;
  
  try {
    const response = await fetchCategoryWithPosts(categorySlug);
    
    if (!response.success || !response.data) {
      return {
        title: 'Category Not Found | 特典速報 パルパル',
        description: '找不到指定的分類'
      };
    }

    return generateBlogCategoryMetadata(response.data);
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category Not Found | 特典速報 パルパル',
      description: '找不到指定的分類'
    };
  }
}

export default async function BlogCategoryPage({ params, searchParams }: BlogCategoryPageProps) {
  const { category: categorySlug } = params;
  const { page = '1', search, tag, sort = 'newest' } = searchParams;
  
  const currentPage = parseInt(page, 10);
  const offset = (currentPage - 1) * 12;

  try {
    // Fetch category details and posts
    const [categoryResult, postsResult] = await Promise.all([
      fetchCategoryWithPosts(categorySlug),
      fetchPostsByCategory(categorySlug, {
        limit: 12,
        offset,
        search,
        tag,
        sort: sort as any,
        status: 'published'
      })
    ]);

    if (!categoryResult.success || !categoryResult.data) {
      notFound();
    }

    if (!postsResult.success) {
      console.error('Failed to fetch category posts:', postsResult.error);
      notFound();
    }

    const pageData = {
      category: categoryResult.data,
      posts: postsResult.data || [],
      pagination: (postsResult as any).pagination,
      searchParams: {
        search,
        tag,
        sort,
        page: currentPage
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BlogCategoryLoading />}>
          <BlogCategoryClient {...pageData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Blog category page error:', error);
    notFound();
  }
}

function BlogCategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Category header skeleton */}
        <div className="mb-12 text-center">
          <div className="h-12 bg-muted animate-pulse rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-96 mx-auto mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-32 mx-auto"></div>
        </div>
        
        {/* Filter bar skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-muted animate-pulse rounded flex-1"></div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
        </div>
        
        {/* Posts grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden">
              <div className="h-[197px] bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination skeleton */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-10 w-10 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}