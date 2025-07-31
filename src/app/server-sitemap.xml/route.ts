const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app';

export async function GET() {
  try {
    // 動態獲取電影列表
    const response = await fetch(`${API_BASE_URL}/api/v1/movies`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // 確保總是獲取最新數據
    });
    
    if (!response.ok) {
      console.error('Failed to fetch movies for server sitemap:', response.status);
      // 返回空的但有效的 sitemap
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      return new Response(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }
    
    const data = await response.json();
    const movies = data.movies || [];
    
    // 手動生成 XML
    const urls = movies.map((movie: any) => {
      const movieId = encodeURIComponent(movie.movie_id);
      const lastmod = new Date(movie.updated_at || new Date()).toISOString();
      return `  <url>
    <loc>https://paruparu.vercel.app/movie/${movieId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    // 返回空的但有效的 sitemap
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}