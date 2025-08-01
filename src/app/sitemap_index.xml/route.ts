export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 靜態頁面 sitemap -->
  <sitemap>
    <loc>https://paruparu.vercel.app/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <!-- 動態生成的電影頁面 sitemap -->
  <sitemap>
    <loc>https://paruparu.vercel.app/server-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    },
  });
}