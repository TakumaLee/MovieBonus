import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase admin client for middleware
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function middleware(request: NextRequest) {
  // 完全跳過 Next.js 圖片優化
  if (request.nextUrl.pathname.startsWith('/_next/image')) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  
  // Admin 路徑保護
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip API routes - they have their own auth
    if (request.nextUrl.pathname.startsWith('/admin/api')) {
      return NextResponse.next();
    }
    
    const sessionToken = request.cookies.get('admin-session')?.value;
    
    // If accessing login page
    if (request.nextUrl.pathname === '/admin/login') {
      if (sessionToken) {
        // Verify session
        const { data: session } = await supabaseAdmin
          .from('admin_sessions')
          .select('user_id, expires_at')
          .eq('id', sessionToken)
          .single();
        
        if (session && new Date(session.expires_at) > new Date()) {
          // Check if user is still admin
          const { data: adminUser } = await supabaseAdmin
            .from('admin_users')
            .select('is_active')
            .eq('id', session.user_id)
            .single();
          
          if (adminUser?.is_active) {
            return NextResponse.redirect(new URL('/admin/feedbacks', request.url));
          }
        }
      }
      return NextResponse.next();
    }
    
    // For other admin pages, require authentication
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Verify session
    const { data: session } = await supabaseAdmin
      .from('admin_sessions')
      .select('user_id, expires_at')
      .eq('id', sessionToken)
      .single();
    
    if (!session || new Date(session.expires_at) < new Date()) {
      // Clear invalid/expired session cookie
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-session');
      return response;
    }
    
    // Check if user is still admin
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('is_active')
      .eq('id', session.user_id)
      .single();
    
    if (!adminUser?.is_active) {
      // User no longer admin
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-session');
      
      // Delete session from database
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('id', sessionToken);
      
      return response;
    }
    
    return NextResponse.next();
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
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * - google-site-verification.html (Google verification)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|google-site-verification.html).*)',
  ],
};