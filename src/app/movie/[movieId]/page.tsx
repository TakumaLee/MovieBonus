import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Film, Gift, Info, ShieldCheck, TriangleAlert, RefreshCw, AlertCircle, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MovieDetailClient } from './MovieDetailClient';
import { Metadata } from 'next';
import { StructuredData } from '@/components/SEO/StructuredData';

interface MovieDetailsPageProps {
  params: Promise<{
    movieId: string;
  }>;
}

// 為靜態匯出提供預設的電影 ID
export async function generateStaticParams() {
  // 返回空陣列，讓所有路由都動態生成
  return [];
}

// 生成動態 metadata
export async function generateMetadata({ params }: MovieDetailsPageProps): Promise<Metadata> {
  const { movieId } = await params;
  
  // 嘗試從 API 獲取電影資料
  let movieData = null;
  let promotionsData = null;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app';
  
  try {
    // 獲取電影基本資料
    const movieResponse = await fetch(`${API_BASE_URL}/api/v1/supabase-movies/movie/${encodeURIComponent(movieId)}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // 1小時重新驗證
    });
    
    if (movieResponse.ok) {
      movieData = await movieResponse.json();
    }

    // 獲取特典資料
    if (movieData) {
      const promotionsResponse = await fetch(`${API_BASE_URL}/api/v1/movie-promotions-query/by-title?movie_title=${encodeURIComponent(movieData.title)}&include_gifts=true&active_only=false`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      });
      
      if (promotionsResponse.ok) {
        promotionsData = await promotionsResponse.json();
      }
    }
  } catch (error) {
    console.error('Failed to fetch movie data for metadata:', error);
  }

  // 如果有電影資料，使用實際資料；否則使用通用資料
  const title = movieData?.title || '電影詳情';
  const promotionsCount = promotionsData?.total_promotions || 0;
  const giftsCount = promotionsData?.promotions?.reduce((total: number, promo: any) => total + (promo.gifts?.length || 0), 0) || 0;
  
  const description = movieData ? 
    `${title} - 電影資訊與特典情報完整收錄！${promotionsCount > 0 ? `共${promotionsCount}個特典活動，${giftsCount}項限定贈品。` : ''}即時更新威秀影城等各大電影院的獨家特典資訊，movie bonus、電影周邊、限定商品一網打盡！` :
    `${title}的詳細資訊、特典情報、上映時間等完整資料。查看最新的電影特典和限定商品資訊。`;
  
  const posterUrl = movieData?.poster_url || '/og-image.jpg';
  
  return {
    title: `${title} - 電影特典情報 | 特典速報 パルパル`,
    description,
    keywords: [
      title,
      `${title} 特典`,
      `${title} movie bonus`,
      '電影特典', '電影禮品', '電影贈品', '電影周邊',
      '威秀影城', '電影院特典', '限定商品', '台灣電影',
      'movie bonus', 'movie perk', 'cinema bonus', 'film bonus',
      'movie gift', 'cinema gift', '特典速報', 'paruparu', 'パルパル',
      ...(movieData?.genre ? [movieData.genre] : []),
      ...(promotionsCount > 0 ? ['首週購票禮', '預售禮', '會員禮'] : [])
    ],
    
    openGraph: {
      title: `${title} - 電影特典情報 | 特典速報 パルパル`,
      description,
      type: 'article',
      url: `https://paruparu.vercel.app/movie/${movieId}`,
      images: [
        {
          url: posterUrl,
          width: 400,
          height: 600,
          alt: `${title}電影海報 - 特典情報`,
        }
      ],
      siteName: '特典速報 パルパル',
      locale: 'zh_TW',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 電影特典情報 | 特典速報 パルパル`,
      description,
      images: [posterUrl],
    },
    
    alternates: {
      canonical: `https://paruparu.vercel.app/movie/${movieId}`,
    },
    
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { movieId } = await params;
  
  // 嘗試獲取電影資料來生成結構化數據
  let movieData = null;
  try {
    // 這裡可以調用你的 API 來獲取電影資料
    // const response = await fetch(`/api/movies/${movieId}`);
    // movieData = await response.json();
  } catch (error) {
    console.error('Failed to fetch movie data:', error);
  }

  const structuredDataProps = movieData ? {
    title: movieData.title,
    description: movieData.description,
    image: movieData.poster_url,
    url: `https://paruparu.vercel.app/movie/${movieId}`,
    genre: movieData.genre ? [movieData.genre] : undefined,
    datePublished: movieData.release_date,
  } : {
    title: '電影詳情',
    url: `https://paruparu.vercel.app/movie/${movieId}`,
  };

  return (
    <>
      <StructuredData type="movie" data={structuredDataProps} />
      <MovieDetailClient params={params} />
    </>
  );
}