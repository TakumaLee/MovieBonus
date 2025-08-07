import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app'
  : 'http://localhost:3000';

// Generic proxy for all admin API endpoints
async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    // Get ALL cookies from the request header directly
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.ip || '',
      'User-Agent': request.headers.get('user-agent') || '',
      'Origin': request.headers.get('origin') || '',
      'X-Same-Origin-Proxy': 'true',
    };
    
    // Forward ALL cookies as-is
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // Build request options
    const options: RequestInit = {
      method: request.method,
      headers,
    };
    
    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const body = await request.json();
        options.body = JSON.stringify(body);
      } catch {
        // No JSON body
      }
    }
    
    // Make request to backend
    const response = await fetch(`${BACKEND_URL}/api/admin/${path}${queryString}`, options);
    
    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Create response
    const nextResponse = NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/json',
      }
    });
    
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
            });
          }
        }
      } catch (error) {
        console.error('Error parsing cookie:', error);
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Admin API proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export all HTTP methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;