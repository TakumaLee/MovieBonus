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
  
  // 嘗試從 API 獲取電影資料（如果可用）
  let movieData = null;
  try {
    // 這裡可以調用你的 API 來獲取電影資料
    // const response = await fetch(`/api/movies/${movieId}`);
    // movieData = await response.json();
  } catch (error) {
    console.error('Failed to fetch movie data for metadata:', error);
  }

  // 如果有電影資料，使用實際資料；否則使用通用資料
  const title = movieData?.title || '電影詳情';
  const description = movieData?.description || 
    `${title}的詳細資訊、特典情報、上映時間等完整資料。查看最新的電影特典和限定商品資訊。`;
  const posterUrl = movieData?.poster_url || '/og-image.jpg';
  
  return {
    title: `${title} - 特典速報`,
    description,
    keywords: [
      title,
      '電影特典',
      '電影資訊',
      '威秀影城',
      '電影時刻表',
      '電影周邊',
      '限定商品',
      '特典速報'
    ],
    
    openGraph: {
      title: `${title} - 特典速報`,
      description,
      type: 'article',
      url: `https://paruparu.vercel.app/movie/${movieId}`,
      images: [
        {
          url: posterUrl,
          width: 400,
          height: 600,
          alt: `${title}電影海報`,
        }
      ],
      siteName: '特典速報',
      locale: 'zh_TW',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 特典速報`,
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