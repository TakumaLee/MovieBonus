import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
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

  // TODO: 當有電影 API 時，動態獲取電影列表
  // 暫時返回靜態頁面，之後可以添加動態電影頁面
  // const movies = await fetchMovies();
  // const moviePages = movies.map((movie) => ({
  //   url: `${baseUrl}/movie/${movie.id}`,
  //   lastModified: new Date(movie.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }))

  return [
    ...staticPages,
    // ...moviePages,
  ]
}