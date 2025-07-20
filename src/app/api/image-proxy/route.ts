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

    // 代理請求圖片，模擬台灣用戶瀏覽器請求
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/avif,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.vscinemas.com.tw/',
        'Origin': 'https://www.vscinemas.com.tw',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
      },
      // 設定超時
      signal: AbortSignal.timeout(15000), // 15秒超時
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