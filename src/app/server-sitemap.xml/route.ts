const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app';

// 可能的 API endpoints 按優先順序排列
const MOVIE_ENDPOINTS = [
  '/api/v1/supabase/movies',
  '/api/v1/movies',
  '/api/v1/movies/all'
];

// 健康檢查函數
async function checkAPIHealth(baseUrl: string): Promise<boolean> {
  try {
    const healthResponse = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5秒超時
    });
    return healthResponse.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

// 嘗試多個 endpoints 獲取電影數據
async function fetchMoviesFromAPI(): Promise<any[]> {
  console.log(`[Sitemap] Starting movie fetch from API: ${API_BASE_URL}`);
  
  // 先進行健康檢查
  const isHealthy = await checkAPIHealth(API_BASE_URL);
  console.log(`[Sitemap] API health check result: ${isHealthy}`);
  
  // 嘗試每個 endpoint
  for (const endpoint of MOVIE_ENDPOINTS) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[Sitemap] Trying endpoint: ${url}`);
    
    try {
      const response = await fetch(`${url}?limit=100`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MovieBonus-Sitemap-Generator/1.0'
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000) // 10秒超時
      });
      
      console.log(`[Sitemap] Response status from ${endpoint}: ${response.status}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(`[Sitemap] Successfully fetched data from ${endpoint}, movie count: ${data.data?.length || 0}`);
          return data.data || [];
        } else {
          console.error(`[Sitemap] Invalid content type from ${endpoint}: ${contentType}`);
        }
      } else {
        const errorText = await response.text();
        console.error(`[Sitemap] Failed response from ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText.substring(0, 200) // 只記錄前200字符
        });
      }
    } catch (error) {
      console.error(`[Sitemap] Error fetching from ${endpoint}:`, {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error
      });
    }
  }
  
  // 所有 endpoints 都失敗
  console.error('[Sitemap] All endpoints failed to fetch movie data');
  return [];
}

export async function GET() {
  const startTime = Date.now();
  console.log('[Sitemap] Starting sitemap generation');
  
  try {
    const movies = await fetchMoviesFromAPI();
    
    if (movies.length === 0) {
      console.warn('[Sitemap] No movies found, returning empty sitemap');
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No movies found at ${new Date().toISOString()} -->
</urlset>`;
      return new Response(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600', // 快取1小時
        },
      });
    }
    
    // 生成 sitemap URLs
    const urls = movies.map((movie: any) => {
      try {
        // 確保有有效的 ID
        if (!movie.id) {
          console.warn('[Sitemap] Movie without ID:', movie.title || 'Unknown');
          return null;
        }
        
        const movieId = encodeURIComponent(movie.id);
        const lastmod = new Date(movie.updated_at || movie.created_at || new Date()).toISOString();
        
        return `  <url>
    <loc>https://paruparu.vercel.app/movie/${movieId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      } catch (error) {
        console.error('[Sitemap] Error processing movie:', movie.title || movie.id, error);
        return null;
      }
    }).filter(Boolean).join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    
    const duration = Date.now() - startTime;
    console.log(`[Sitemap] Successfully generated sitemap with ${movies.length} movies in ${duration}ms`);
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // 快取1小時
        'X-Sitemap-Count': String(movies.length),
        'X-Generation-Time': String(duration),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Sitemap] Fatal error generating sitemap:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration
    });
    
    // 返回有效的空 sitemap
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error generating sitemap at ${new Date().toISOString()} -->
  <!-- Check server logs for details -->
</urlset>`;
    
    return new Response(errorSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // 錯誤時快取5分鐘
        'X-Error': 'true',
      },
    });
  }
}