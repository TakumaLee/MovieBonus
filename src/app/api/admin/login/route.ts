import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app'
  : 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Forward the request to backend
    const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward important headers
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.ip || '',
        'User-Agent': request.headers.get('user-agent') || '',
        'Origin': request.headers.get('origin') || '',
        // Identify this as a trusted same-origin proxy request
        'X-Same-Origin-Proxy': 'true',
        // Forward cookies
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Create response
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    // Forward any cookies from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Parse and set cookies
      const cookies = setCookieHeader.split(',').map(c => c.trim());
      cookies.forEach(cookie => {
        const [nameValue, ...options] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        
        // Set cookie with same-site lax for better compatibility
        nextResponse.cookies.set({
          name: name.trim(),
          value: value.trim(),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      });
    }
    
    // If login successful and token provided, also set it as HTTP-only cookie
    if (data.success && data.token) {
      nextResponse.cookies.set({
        name: 'admin-token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}