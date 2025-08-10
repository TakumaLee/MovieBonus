/**
 * Blog SEO Utilities
 * 
 * This module provides SEO optimization functions for blog pages,
 * including metadata generation, structured data, and Open Graph tags.
 */

import { Metadata } from 'next';
import { BlogPost, BlogCategory, BlogSEOData } from './types';

const SITE_NAME = '特典速報 パルパル';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paruparu.vercel.app';
const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Generate metadata for blog homepage
 */
export function generateBlogHomeMetadata(): Metadata {
  const title = `電影部落格 | ${SITE_NAME} - 台灣電影特典資訊與觀影指南`;
  const description = '探索最新電影資訊、特典情報、觀影指南與影評分析。台灣最完整的電影部落格，為影迷提供專業的電影內容與限定商品資訊。';
  const url = `${SITE_URL}/blog`;

  return {
    title,
    description,
    keywords: [
      '電影部落格', '電影評論', '電影特典', '觀影指南',
      '電影資訊', '影評', '電影新聞', '台灣電影',
      'movie blog', 'film review', 'cinema news',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'zh_TW',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: '特典速報部落格 - 電影資訊與特典情報'
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': `${SITE_URL}/blog/rss.xml`,
      },
    },
  };
}

/**
 * Generate metadata for individual blog post
 */
export function generateBlogPostMetadata(
  post: BlogPost,
  seoData?: BlogSEOData | null
): Metadata {
  const title = seoData?.title || post.seo_title || `${post.title} | ${SITE_NAME}`;
  const description = seoData?.description || post.seo_description || post.excerpt || 
    post.content.substring(0, 160) + '...';
  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.cover_image || seoData?.og_image || DEFAULT_OG_IMAGE;
  
  // Keywords from SEO data, post tags, and defaults
  const keywords = [
    ...(seoData?.keywords || []),
    ...post.tags,
    '電影', '特典', '觀影指南',
  ];

  const publishedTime = post.published_at || post.created_at;
  const modifiedTime = post.updated_at;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: seoData?.og_title || post.og_title || title,
      description: seoData?.og_description || post.og_description || description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'zh_TW',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }],
      publishedTime,
      modifiedTime,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitter_title || post.twitter_title || title,
      description: seoData?.twitter_description || post.twitter_description || description,
      images: [post.twitter_image || imageUrl],
    },
    alternates: {
      canonical: seoData?.canonical_url || post.canonical_url || url,
    },
  };

  return metadata;
}

/**
 * Generate metadata for blog category pages
 */
export function generateBlogCategoryMetadata(category: BlogCategory): Metadata {
  const title = `${category.name} | ${SITE_NAME} - 電影特典資訊`;
  const description = category.description || 
    `瀏覽 ${category.name} 相關的電影文章，包含最新資訊、特典情報與觀影指南。專業的電影內容，盡在特典速報。`;
  const url = `${SITE_URL}/blog/category/${category.slug}`;

  return {
    title,
    description,
    keywords: [
      category.name,
      '電影分類', '電影資訊', '特典情報',
      'movie category', 'film news',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'zh_TW',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${category.name} - 特典速報`
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for blog tag pages
 */
export function generateBlogTagMetadata(tag: string): Metadata {
  const title = `#${tag} | ${SITE_NAME} - 相關文章`;
  const description = `查看所有標籤為「${tag}」的電影文章。包含相關的電影資訊、特典情報與觀影指南。`;
  const url = `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`;

  return {
    title,
    description,
    keywords: [
      tag,
      '電影標籤', '相關文章', '電影資訊',
      'movie tag', 'related posts',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'zh_TW',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${tag} 相關文章 - 特典速報`
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for blog search pages
 */
export function generateBlogSearchMetadata(query: string): Metadata {
  const title = query 
    ? `搜尋「${query}」| ${SITE_NAME} - 文章搜尋結果`
    : `文章搜尋 | ${SITE_NAME} - 探索電影內容`;
  
  const description = query
    ? `搜尋「${query}」的相關電影文章和資訊。找到最符合您需求的電影內容、特典情報與觀影指南。`
    : '搜尋電影相關文章、特典資訊與觀影指南。使用我們的搜尋功能，快速找到您感興趣的電影內容。';
  
  const url = query 
    ? `${SITE_URL}/blog/search?q=${encodeURIComponent(query)}`
    : `${SITE_URL}/blog/search`;

  return {
    title,
    description,
    keywords: [
      '文章搜尋', '電影搜尋', '內容搜尋',
      query ? `${query}相關` : '',
      'blog search', 'movie search',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'zh_TW',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: query ? `搜尋「${query}」- 特典速報` : '文章搜尋 - 特典速報'
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: !query, // Don't index search result pages with queries
      follow: true,
    },
  };
}

/**
 * Generate JSON-LD structured data for blog post
 */
export function generateBlogPostStructuredData(post: BlogPost): any {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: post.cover_image ? {
      '@type': 'ImageObject',
      url: post.cover_image,
      width: 1200,
      height: 630
    } : undefined,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.bio
    } : {
      '@type': 'Organization',
      name: SITE_NAME
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    articleSection: post.category?.name,
    keywords: post.tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.reading_time || 5}M`,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`
    },
    // Add movie-specific structured data if related to movies
    ...(post.primary_movie && {
      about: {
        '@type': 'Movie',
        name: post.primary_movie.title,
        alternateName: post.primary_movie.english_title,
        description: post.primary_movie.synopsis,
        datePublished: post.primary_movie.release_date,
        director: post.primary_movie.director.map(name => ({ '@type': 'Person', name })),
        actor: post.primary_movie.movie_cast.map(name => ({ '@type': 'Person', name })),
        genre: post.primary_movie.genre,
      }
    })
  };

  return structuredData;
}

/**
 * Generate JSON-LD structured data for blog homepage
 */
export function generateBlogHomeStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} 電影部落格`,
    description: '台灣最完整的電影特典資訊與觀影指南部落格',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    },
    inLanguage: 'zh-TW',
    about: {
      '@type': 'Thing',
      name: '電影',
      sameAs: 'https://zh.wikipedia.org/wiki/电影'
    }
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Extract reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed for Chinese text
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate social sharing URLs optimized for Taiwan
 */
export function generateSocialShareUrls(data: {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}) {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedDescription = encodeURIComponent(data.description || '');
  const hashtagString = data.hashtags?.map(tag => `#${tag}`).join(' ') || '';

  return {
    // LINE is most popular in Taiwan
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
    
    // Facebook still important
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    
    // Twitter/X
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtagString ? `&hashtags=${encodeURIComponent(hashtagString)}` : ''}`,
    
    // WhatsApp
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    
    // Email
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    
    // Copy link (handled in frontend)
    copy: data.url
  };
}

/**
 * Optimize meta description for Chinese content
 */
export function optimizeMetaDescription(content: string, maxLength = 160): string {
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // For Chinese text, cut at sentence boundaries
  const sentences = cleanContent.split(/[。！？]/);
  let result = '';
  
  for (const sentence of sentences) {
    if ((result + sentence + '。').length > maxLength) {
      break;
    }
    result += sentence + '。';
  }
  
  return result || cleanContent.substring(0, maxLength - 3) + '...';
}

export default {
  generateBlogHomeMetadata,
  generateBlogPostMetadata,
  generateBlogCategoryMetadata,
  generateBlogTagMetadata,
  generateBlogSearchMetadata,
  generateBlogPostStructuredData,
  generateBlogHomeStructuredData,
  generateBreadcrumbStructuredData,
  calculateReadingTime,
  generateSocialShareUrls,
  optimizeMetaDescription,
};