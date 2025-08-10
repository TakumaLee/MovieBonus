/**
 * Blog Homepage - Main Blog Listing Page
 * 
 * Features:
 * - Hero carousel with featured posts
 * - Category navigation cards
 * - Latest posts grid with sidebar
 * - ISR for optimal performance
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogHomepageClient from './BlogHomepageClient';
import { fetchFeaturedPosts, fetchLatestPosts, fetchBlogCategories, fetchPopularPosts } from '@/lib/blog-api-client';
import { generateBlogHomeMetadata } from '@/lib/blog-seo-utils';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogHomeMetadata();
}

export default async function BlogHomepage() {
  try {
    // Fetch data in parallel for better performance
    const [
      featuredPostsResult,
      latestPostsResult,
      categoriesResult,
      popularPostsResult
    ] = await Promise.all([
      fetchFeaturedPosts(5),
      fetchLatestPosts(12, 0),
      fetchBlogCategories(),
      fetchPopularPosts('month', 10)
    ]);

    // Handle errors
    if (!featuredPostsResult.success || !latestPostsResult.success || 
        !categoriesResult.success || !popularPostsResult.success) {
      console.error('Blog homepage data fetch error:', {
        featured: featuredPostsResult.error,
        latest: latestPostsResult.error,
        categories: categoriesResult.error,
        popular: popularPostsResult.error
      });
      notFound();
    }

    const pageData = {
      featuredPosts: featuredPostsResult.data || [],
      latestPosts: latestPostsResult.data || [],
      categories: categoriesResult.data || [],
      popularPosts: popularPostsResult.data || [],
      pagination: (latestPostsResult as any).pagination
    };

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BlogHomepageLoading />}>
          <BlogHomepageClient {...pageData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Blog homepage error:', error);
    notFound();
  }
}

function BlogHomepageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Featured posts skeleton */}
        <div className="mb-12">
          <div className="h-[450px] bg-muted animate-pulse rounded-lg"></div>
        </div>
        
        {/* Categories skeleton */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-[120px] bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Latest posts skeleton */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
          
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg">
              <div className="h-6 bg-muted animate-pulse rounded mb-4"></div>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded mb-2"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}