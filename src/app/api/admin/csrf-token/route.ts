import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app'
  : 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Forward the request to backend
    const response = await fetch(`${BACKEND_URL}/api/admin/csrf-token`, {
      method: 'GET',
      headers: {
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.ip || '',
        'User-Agent': request.headers.get('user-agent') || '',
        'Origin': request.headers.get('origin') || '',
        // Identify this as a trusted same-origin proxy request
        'X-Same-Origin-Proxy': 'true',
        // Forward cookies
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
    });

    const data = await response.json();
    
    // Create response
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    // Forward any cookies from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      try {
        // Parse the cookie more carefully to handle values that may contain special characters
        const cookieParts = setCookieHeader.split(';');
        const nameValuePart = cookieParts[0];
        
        if (nameValuePart) {
          // Find the first = to split name and value
          const firstEqualIndex = nameValuePart.indexOf('=');
          if (firstEqualIndex > 0) {
            const name = nameValuePart.substring(0, firstEqualIndex).trim();
            const value = nameValuePart.substring(firstEqualIndex + 1).trim();
            
            nextResponse.cookies.set({
              name: name,
              value: value,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60, // 1 hour
            });
          }
        }
      } catch (error) {
        console.error('Error parsing cookie:', error);
        // Don't throw - continue with response even if cookie parsing fails
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error('CSRF token proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}