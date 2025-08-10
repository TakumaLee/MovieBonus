/**
 * Blog Tag Archive Page
 * 
 * Features:
 * - Dynamic tag-based post filtering
 * - SEO optimized tag pages
 * - Similar tags suggestions
 * - Pagination support
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogTagClient from './BlogTagClient';
import { fetchBlogPosts } from '@/lib/blog-api-client';
import { generateBlogTagMetadata } from '@/lib/blog-seo-utils';

interface BlogTagPageProps {
  params: {
    tag: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
  };
}

// Enable ISR
export const revalidate = 600; // 10 minutes

export async function generateMetadata({ params }: BlogTagPageProps): Promise<Metadata> {
  const { tag } = params;
  const decodedTag = decodeURIComponent(tag);
  
  return generateBlogTagMetadata(decodedTag);
}

export default async function BlogTagPage({ params, searchParams }: BlogTagPageProps) {
  const { tag } = params;
  const { page = '1', sort = 'newest' } = searchParams;
  
  const decodedTag = decodeURIComponent(tag);
  const currentPage = parseInt(page, 10);
  const offset = (currentPage - 1) * 12;

  try {
    // Fetch posts with the specific tag
    const postsResult = await fetchBlogPosts({
      tag: decodedTag,
      limit: 12,
      offset,
      sort: sort as any,
      status: 'published'
    });

    if (!postsResult.success) {
      console.error('Failed to fetch tag posts:', postsResult.error);
      notFound();
    }

    const posts = postsResult.data || [];
    
    // If no posts found for this tag, show 404
    if (posts.length === 0 && currentPage === 1) {
      notFound();
    }

    const pageData = {
      tag: decodedTag,
      posts,
      pagination: (postsResult as any).pagination,
      searchParams: {
        sort,
        page: currentPage
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BlogTagLoading tag={decodedTag} />}>
          <BlogTagClient {...pageData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Blog tag page error:', error);
    notFound();
  }
}

function BlogTagLoading({ tag }: { tag: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Tag header skeleton */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-muted animate-pulse rounded"></div>
            <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
          </div>
          <div className="h-4 bg-muted animate-pulse rounded w-80 mx-auto mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-32 mx-auto"></div>
        </div>
        
        {/* Sort options skeleton */}
        <div className="mb-8 flex justify-end">
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