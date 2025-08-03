import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://paruparu.vercel.app'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app'
    
    // 獲取電影資料
    const response = await fetch(`${apiUrl}/api/v1/supabase/movies?limit=500`, {
      headers: {
        'User-Agent': 'MovieBonus-Sitemap-Generator/1.0',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`)
    }
    
    const data = await response.json()
    const movies = data.data || []
    
    // 生成 XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${movies.map((movie: any) => `  <url>
    <loc>${baseUrl}/movie/${encodeURIComponent(movie.id)}</loc>
    <lastmod>${new Date(movie.updated_at || movie.created_at || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
    
  } catch (error) {
    console.error('Error generating movie sitemap:', error)
    
    // 錯誤時返回基本 sitemap
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://paruparu.vercel.app/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    })
  }
}
