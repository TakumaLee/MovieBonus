/**
 * Blog API Client
 * 
 * This module provides TypeScript-based API client functions for the MovieBonus blog system.
 * All functions include proper error handling, response validation, and support for SSR/SSG.
 */

import { 
  ApiResponse, 
  PaginatedResponse,
  BlogPost, 
  BlogCategory, 
  BlogPostQueryParams,
  BlogPostsResponse,
  BlogSearchParams,
  BlogSearchResult,
  PopularPost,
  RelatedPost,
  BlogSEOData,
  BlogDashboardStats,
  ContentTemplate,
  ContentGenerationRequest,
  GeneratedContent
} from './types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const BLOG_API_BASE = `${API_BASE_URL}/api/v1/blog`;

// Request configuration
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/xml') || contentType?.includes('application/xml')) {
      data = await response.text();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Handle direct data responses (non-wrapped responses)
    if (typeof data === 'string' || !data.hasOwnProperty('success')) {
      return {
        success: true,
        data: data as T,
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

// ============================================================================
// Blog Posts API
// ============================================================================

/**
 * Fetch blog posts with optional filtering, sorting, and pagination
 */
export async function fetchBlogPosts(
  params: BlogPostQueryParams = {}
): Promise<BlogPostsResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const url = `${BLOG_API_BASE}/posts?${searchParams.toString()}`;
  return apiRequest<BlogPost[]>(url);
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPost(slug: string): Promise<ApiResponse<BlogPost>> {
  const url = `${BLOG_API_BASE}/posts/${slug}`;
  return apiRequest<BlogPost>(url);
}

/**
 * Fetch featured blog posts for homepage
 */
export async function fetchFeaturedPosts(limit = 5): Promise<ApiResponse<BlogPost[]>> {
  return fetchBlogPosts({ featured: true, limit, status: 'published' });
}

/**
 * Fetch latest blog posts
 */
export async function fetchLatestPosts(
  limit = 10, 
  offset = 0
): Promise<BlogPostsResponse> {
  return fetchBlogPosts({ 
    limit, 
    offset, 
    status: 'published', 
    sort: 'newest' 
  });
}

/**
 * Fetch related posts for a given post
 */
export async function fetchRelatedPosts(
  postId: string, 
  limit = 3
): Promise<ApiResponse<RelatedPost[]>> {
  const url = `${BLOG_API_BASE}/search/related?post_id=${postId}&limit=${limit}`;
  return apiRequest<RelatedPost[]>(url);
}

// ============================================================================
// Categories API
// ============================================================================

/**
 * Fetch all blog categories with hierarchy
 */
export async function fetchBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  const url = `${BLOG_API_BASE}/categories`;
  return apiRequest<BlogCategory[]>(url);
}

/**
 * Fetch posts by category
 */
export async function fetchPostsByCategory(
  categorySlug: string,
  params: Omit<BlogPostQueryParams, 'category'> = {}
): Promise<BlogPostsResponse> {
  return fetchBlogPosts({ ...params, category: categorySlug });
}

/**
 * Fetch category details with posts
 */
export async function fetchCategoryWithPosts(
  categorySlug: string
): Promise<ApiResponse<BlogCategory & { posts: BlogPost[] }>> {
  const url = `${BLOG_API_BASE}/categories/${categorySlug}`;
  return apiRequest<BlogCategory & { posts: BlogPost[] }>(url);
}

// ============================================================================
// Search API
// ============================================================================

/**
 * Search blog posts with full-text search
 */
export async function searchBlogPosts(
  params: BlogSearchParams
): Promise<ApiResponse<BlogSearchResult>> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${BLOG_API_BASE}/search?${searchParams.toString()}`;
  return apiRequest<BlogSearchResult>(url);
}

/**
 * Get search suggestions for autocomplete
 */
export async function fetchSearchSuggestions(
  query: string
): Promise<ApiResponse<string[]>> {
  const url = `${BLOG_API_BASE}/search/suggestions?q=${encodeURIComponent(query)}`;
  return apiRequest<string[]>(url);
}

/**
 * Get trending search terms
 */
export async function fetchTrendingSearches(): Promise<ApiResponse<string[]>> {
  const url = `${BLOG_API_BASE}/search/trending`;
  return apiRequest<string[]>(url);
}

/**
 * Get popular posts with time-based filtering
 */
export async function fetchPopularPosts(
  timeframe: 'week' | 'month' | 'year' | 'all' = 'month',
  limit = 10
): Promise<ApiResponse<PopularPost[]>> {
  const url = `${BLOG_API_BASE}/search/popular?timeframe=${timeframe}&limit=${limit}`;
  return apiRequest<PopularPost[]>(url);
}

// ============================================================================
// SEO API
// ============================================================================

/**
 * Get SEO metadata for a blog post
 */
export async function fetchPostSEOData(slug: string): Promise<ApiResponse<BlogSEOData>> {
  const url = `${BLOG_API_BASE}/seo/meta/${slug}`;
  return apiRequest<BlogSEOData>(url);
}

/**
 * Get structured data (JSON-LD) for a blog post
 */
export async function fetchStructuredData(slug: string): Promise<ApiResponse<any>> {
  const url = `${BLOG_API_BASE}/seo/structured-data/${slug}`;
  return apiRequest<any>(url);
}

/**
 * Get XML sitemap for blog
 */
export async function fetchBlogSitemap(): Promise<ApiResponse<string>> {
  const url = `${BLOG_API_BASE}/seo/sitemap.xml`;
  return apiRequest<string>(url);
}

/**
 * Get RSS feed for blog
 */
export async function fetchBlogRSS(): Promise<ApiResponse<string>> {
  const url = `${BLOG_API_BASE}/seo/rss`;
  return apiRequest<string>(url);
}

// ============================================================================
// Analytics API
// ============================================================================

/**
 * Track a blog post view (public endpoint)
 */
export async function trackPostView(
  postId: string,
  metadata: {
    referrer?: string;
    user_agent?: string;
    page_url: string;
  }
): Promise<ApiResponse<void>> {
  const url = `${BLOG_API_BASE}/analytics/view`;
  return apiRequest<void>(url, {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      ...metadata,
    }),
  });
}

/**
 * Track user engagement (scroll, time, interactions)
 */
export async function trackEngagement(
  postId: string,
  engagementData: {
    scroll_depth: number;
    time_on_page: number;
    interactions: number;
  }
): Promise<ApiResponse<void>> {
  const url = `${BLOG_API_BASE}/analytics/engagement`;
  return apiRequest<void>(url, {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      engagement_data: engagementData,
    }),
  });
}

// ============================================================================
// Content Generation API (Admin)
// ============================================================================

/**
 * Get available content templates
 */
export async function fetchContentTemplates(): Promise<ApiResponse<ContentTemplate[]>> {
  const url = `${BLOG_API_BASE}/generate/templates`;
  return apiRequest<ContentTemplate[]>(url);
}

/**
 * Generate blog content using AI
 */
export async function generateContent(
  request: ContentGenerationRequest
): Promise<ApiResponse<GeneratedContent>> {
  const url = `${BLOG_API_BASE}/generate`;
  return apiRequest<GeneratedContent>(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Generate movie-specific content
 */
export async function generateMovieContent(
  movieId: string,
  templateId?: string
): Promise<ApiResponse<GeneratedContent>> {
  const url = `${BLOG_API_BASE}/generate/movie/${movieId}`;
  const body: any = {};
  if (templateId) body.template_id = templateId;
  
  return apiRequest<GeneratedContent>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Build query string from parameters object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  return searchParams.toString();
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract text content from HTML
 */
export function extractTextFromHTML(html: string): string {
  // Simple HTML tag removal - in production, consider using a proper HTML parser
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  const text = extractTextFromHTML(content);
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Format date for display (Taiwan locale)
 */
export function formatDate(dateString: string, locale = 'zh-TW'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string, locale = 'zh-TW'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '剛剛';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分鐘前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小時前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  
  return formatDate(dateString, locale);
}

/**
 * Validate and sanitize blog post slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '-') // Allow Chinese characters
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate social sharing URLs
 */
export function generateShareUrls(data: {
  url: string;
  title: string;
  description?: string;
}) {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedDescription = encodeURIComponent(data.description || '');

  return {
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription} ${encodedUrl}`,
  };
}

export default {
  // Posts
  fetchBlogPosts,
  fetchBlogPost,
  fetchFeaturedPosts,
  fetchLatestPosts,
  fetchRelatedPosts,
  
  // Categories
  fetchBlogCategories,
  fetchPostsByCategory,
  fetchCategoryWithPosts,
  
  // Search
  searchBlogPosts,
  fetchSearchSuggestions,
  fetchTrendingSearches,
  fetchPopularPosts,
  
  // SEO
  fetchPostSEOData,
  fetchStructuredData,
  fetchBlogSitemap,
  fetchBlogRSS,
  
  // Analytics
  trackPostView,
  trackEngagement,
  
  // Content Generation
  fetchContentTemplates,
  generateContent,
  generateMovieContent,
  
  // Utilities
  buildQueryString,
  calculateReadingTime,
  extractTextFromHTML,
  generateExcerpt,
  formatDate,
  formatRelativeTime,
  sanitizeSlug,
  generateShareUrls,
};