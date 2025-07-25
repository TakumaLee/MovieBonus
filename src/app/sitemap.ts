import { MetadataRoute } from 'next'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app';

async function fetchMoviesForSitemap() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/supabase-movies/movies?limit=100&status=all`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch movies for sitemap:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.movies || [];
  } catch (error) {
    console.error('Error fetching movies for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paruparu.vercel.app'
  
  // 靜態頁面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // 動態獲取電影列表
  const movies = await fetchMoviesForSitemap();
  const moviePages = movies.map((movie: any) => ({
    url: `${baseUrl}/movie/${encodeURIComponent(movie.movie_id)}`,
    lastModified: new Date(movie.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...moviePages,
  ]
}