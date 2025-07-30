import { getServerSideSitemap } from 'next-sitemap'
import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app';

export async function GET() {
  try {
    // 動態獲取電影列表
    const response = await fetch(`${API_BASE_URL}/api/v1/supabase-movies/movies?limit=1000&status=all`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // 緩存1小時
    });
    
    if (!response.ok) {
      console.error('Failed to fetch movies for server sitemap:', response.status);
      return getServerSideSitemap([]);
    }
    
    const data = await response.json();
    const movies = data.movies || [];
    
    // 生成電影頁面的 sitemap 條目
    const movieUrls = movies.map((movie: any) => ({
      loc: `https://paruparu.vercel.app/movie/${encodeURIComponent(movie.movie_id)}`,
      lastmod: new Date(movie.updated_at || new Date()).toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));
    
    return getServerSideSitemap(movieUrls);
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    return getServerSideSitemap([]);
  }
}