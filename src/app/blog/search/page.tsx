/**
 * Blog Search Results Page
 * 
 * Features:
 * - Full-text search with suggestions
 * - Advanced filtering options
 * - Trending searches display
 * - Real-time search results
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogSearchClient from './BlogSearchClient';
import { 
  searchBlogPosts, 
  fetchTrendingSearches, 
  fetchSearchSuggestions 
} from '@/lib/blog-api-client';
import { generateBlogSearchMetadata } from '@/lib/blog-seo-utils';

interface BlogSearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
    date_from?: string;
    date_to?: string;
  };
}

// Shorter revalidation for search results
export const revalidate = 300; // 5 minutes

export async function generateMetadata({ searchParams }: BlogSearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  return generateBlogSearchMetadata(query);
}

export default async function BlogSearchPage({ searchParams }: BlogSearchPageProps) {
  const {
    q: query = '',
    category,
    tag,
    page = '1',
    date_from,
    date_to
  } = searchParams;

  const currentPage = parseInt(page, 10);
  const offset = (currentPage - 1) * 10;

  try {
    let searchResults: any = {
      success: true,
      data: {
        posts: [],
        suggestions: [],
        trending_searches: [],
        total_results: 0,
        search_time: 0
      }
    };

    let trendingSearches: string[] = [];

    // Fetch trending searches
    const trendingResult = await fetchTrendingSearches();
    if (trendingResult.success) {
      trendingSearches = trendingResult.data || [];
    }

    // Only search if there's a query
    if (query.trim()) {
      searchResults = await searchBlogPosts({
        q: query,
        category,
        tag,
        date_from,
        date_to,
        limit: 10,
        offset
      });
    }

    const pageData = {
      query,
      results: searchResults.success ? searchResults.data : {
        posts: [],
        suggestions: [],
        trending_searches: trendingSearches,
        total_results: 0,
        search_time: 0
      },
      trendingSearches,
      filters: {
        category,
        tag,
        date_from,
        date_to
      },
      pagination: {
        current_page: currentPage,
        has_more: searchResults.success ? 
          (searchResults.data?.posts?.length || 0) === 10 : false
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BlogSearchLoading query={query} />}>
          <BlogSearchClient {...pageData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Blog search page error:', error);
    
    // Return empty results with error state
    const pageData = {
      query,
      results: {
        posts: [],
        suggestions: [],
        trending_searches: [],
        total_results: 0,
        search_time: 0
      },
      trendingSearches: [],
      filters: {
        category,
        tag,
        date_from,
        date_to
      },
      pagination: {
        current_page: currentPage,
        has_more: false
      },
      error: 'Search service temporarily unavailable'
    };

    return (
      <div className="min-h-screen bg-background">
        <BlogSearchClient {...pageData} />
      </div>
    );
  }
}

function BlogSearchLoading({ query }: { query: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search header skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-muted animate-pulse rounded w-full mb-4"></div>
          {query && (
            <div className="h-6 bg-muted animate-pulse rounded w-64 mb-4"></div>
          )}
        </div>
        
        {/* Filters skeleton */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
          <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
          <div className="h-10 bg-muted animate-pulse rounded w-40"></div>
        </div>
        
        {query ? (
          // Search results skeleton
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted animate-pulse rounded flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Trending searches skeleton
          <div>
            <div className="h-6 bg-muted animate-pulse rounded w-32 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {Array(10).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-8 bg-muted animate-pulse rounded ${
                    i % 3 === 0 ? 'w-20' : i % 3 === 1 ? 'w-16' : 'w-24'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}