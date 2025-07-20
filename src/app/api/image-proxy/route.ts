import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // 檢查是否為允許的域名
    const allowedDomains = [
      'www.vscinemas.com.tw',
      'vscinemas.com.tw',
      'placehold.co',
      'via.placeholder.com'
    ];
    
    let isAllowed = false;
    try {
      const url = new URL(imageUrl);
      isAllowed = allowedDomains.includes(url.hostname);
    } catch {
      return new NextResponse('Invalid URL', { status: 400 });
    }
    
    if (!isAllowed) {
      return new NextResponse('Domain not allowed', { status: 403 });
    }

    // 代理請求圖片，模擬瀏覽器請求
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.vscinemas.com.tw/',
      },
      // 設定超時
      signal: AbortSignal.timeout(10000), // 10秒超時
    });

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      // 返回預設圖片
      return NextResponse.redirect(new URL('https://placehold.co/400x600.png?text=圖片載入失敗'));
    }

    // 獲取圖片內容
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 返回圖片，設定適當的快取標頭
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 快取 1 小時，CDN 快取 1 天
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    // 返回預設圖片
    return NextResponse.redirect(new URL('https://placehold.co/400x600.png?text=載入錯誤'));
  }
}