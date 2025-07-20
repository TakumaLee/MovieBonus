import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 完全跳過 Next.js 圖片優化
  if (request.nextUrl.pathname.startsWith('/_next/image')) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};