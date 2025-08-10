/**
 * Individual Blog Post Page
 * 
 * Features:
 * - SSG generation for all published posts
 * - Full SEO optimization with structured data
 * - Reading progress and social sharing
 * - Related posts and movie integration
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogPostClient from './BlogPostClient';
import { 
  fetchBlogPost, 
  fetchRelatedPosts, 
  fetchPostSEOData,
  fetchStructuredData 
} from '@/lib/blog-api-client';
import { generateBlogPostMetadata } from '@/lib/blog-seo-utils';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Enable ISR with longer cache for individual posts
export const revalidate = 900; // 15 minutes

export async function generateStaticParams() {
  // Generate static params for published posts
  // In production, this would fetch from your API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/posts?status=published&limit=1000`);
    
    if (!response.ok) {
      console.warn('Failed to fetch posts for static generation');
      return [];
    }
    
    const data = await response.json();
    const posts = data.data || [];
    
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const [postResult, seoResult] = await Promise.all([
      fetchBlogPost(slug),
      fetchPostSEOData(slug)
    ]);

    if (!postResult.success || !postResult.data) {
      return {
        title: 'Post Not Found | 特典速報 パルパル',
        description: '找不到指定的文章'
      };
    }

    const post = postResult.data;
    const seoData = seoResult.success ? seoResult.data : null;

    return generateBlogPostMetadata(post, seoData);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found | 特典速報 パルパル',
      description: '找不到指定的文章'
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  try {
    // Fetch post data and related content
    const [postResult, relatedResult, structuredDataResult] = await Promise.all([
      fetchBlogPost(slug),
      fetchRelatedPosts('', 3), // Will need post ID after fetching
      fetchStructuredData(slug)
    ]);

    if (!postResult.success || !postResult.data) {
      notFound();
    }

    const post = postResult.data;

    // Fetch related posts with the actual post ID
    const relatedPostsResult = await fetchRelatedPosts(post.id, 3);

    const pageData = {
      post,
      relatedPosts: relatedPostsResult.success ? relatedPostsResult.data : [],
      structuredData: structuredDataResult.success ? structuredDataResult.data : null,
    };

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BlogPostLoading />}>
          <BlogPostClient {...pageData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Blog post page error:', error);
    notFound();
  }
}

function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Reading progress skeleton */}
        <div className="h-1 bg-muted animate-pulse mb-8"></div>
        
        {/* Hero image skeleton */}
        <div className="h-[400px] bg-muted animate-pulse rounded-lg mb-8"></div>
        
        {/* Title and meta skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="prose max-w-none">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className={`h-4 bg-muted animate-pulse rounded mb-4 ${
              i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/5'
            }`}></div>
          ))}
        </div>
        
        {/* Related posts skeleton */}
        <div className="mt-16">
          <div className="h-6 bg-muted animate-pulse rounded w-32 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden">
                <div className="h-[160px] bg-muted animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}