import { MetadataRoute } from 'next'

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
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  // 動態取得電影頁面
  let moviePages: MetadataRoute.Sitemap = []
  
  try {
    // 簡單的 API 呼叫取得電影清單
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app'}/api/v1/supabase/movies?limit=1000`,
      { 
        next: { revalidate: 3600 }, // 快取 1 小時
        headers: {
          'User-Agent': 'MovieBonus-Sitemap-Generator/1.0'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      const movies = data.data || []
      
      // 限制電影數量避免 sitemap 過大
      const limitedMovies = movies.slice(0, 500)
      
      moviePages = limitedMovies.map((movie: any) => ({
        url: `${baseUrl}/movie/${encodeURIComponent(movie.id)}`,
        lastModified: new Date(movie.updated_at || movie.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      
      console.log(`Sitemap generated with ${staticPages.length} static pages and ${moviePages.length} movie pages`)
    } else {
      console.warn(`API response not ok: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error fetching movies for sitemap:', error)
    // 即使 API 失敗，也要返回靜態頁面
  }
  
  return [...staticPages, ...moviePages]
}