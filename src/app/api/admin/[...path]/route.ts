import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    
    // Get cookies to forward
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin-session');
    const adminToken = cookieStore.get('admin-token');
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.ip || '',
      'User-Agent': request.headers.get('user-agent') || '',
    };
    
    // Forward authentication
    if (adminSession) {
      headers['Cookie'] = `admin-session=${adminSession.value}`;
    } else if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken.value}`;
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
      const cookies = setCookieHeader.split(',').map(c => c.trim());
      cookies.forEach(cookie => {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        
        if (name && value) {
          nextResponse.cookies.set({
            name: name.trim(),
            value: value.trim(),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        }
      });
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