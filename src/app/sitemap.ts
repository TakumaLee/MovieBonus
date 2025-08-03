import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paruparu.vercel.app'
  
  // 靜態頁面 - 只包含真實存在的頁面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]
  
  // 動態取得電影頁面
  let moviePages: MetadataRoute.Sitemap = []
  
  // 在生產環境中嘗試取得電影資料，但不讓建置失敗
  if (process.env.NODE_ENV === 'production') {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app'
      const fullUrl = `${apiUrl}/api/v1/supabase/movies?limit=100`
      
      console.log('Sitemap: Attempting to fetch movies from:', fullUrl)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 秒逾時
      
      const response = await fetch(fullUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'MovieBonus-Sitemap-Generator/1.0',
          'Accept': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        const movies = data.data || []
        
        if (movies.length > 0) {
          moviePages = movies.slice(0, 50).map((movie: any) => ({
            url: `${baseUrl}/movie/${encodeURIComponent(movie.id)}`,
            lastModified: new Date(movie.updated_at || movie.created_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
          
          console.log(`Sitemap: Successfully added ${moviePages.length} movie pages`)
        }
      }
    } catch (error) {
      console.log('Sitemap: Could not fetch movies during build, using static sitemap only')
      // 不拋出錯誤，只返回靜態頁面
    }
  }
  
  return [...staticPages, ...moviePages]
}