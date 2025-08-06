'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DebugMobilePage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [cookies, setCookies] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Collect debug information
    const info = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      cookieEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      vendor: navigator.vendor,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      isAndroid: /Android/i.test(navigator.userAgent),
      origin: window.location.origin,
      href: window.location.href,
    };
    setDebugInfo(info);
    
    // Get all cookies
    setCookies(document.cookie || 'No cookies found');
  }, []);

  const testCsrfToken = async () => {
    try {
      setTestResult('Testing CSRF token...');
      
      const response = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setCsrfToken(data.csrfToken || 'No token received');
      
      // Check cookies after request
      setCookies(document.cookie || 'No cookies after request');
      
      setTestResult(`CSRF Token Response: ${JSON.stringify(data, null, 2)}\nCookies: ${document.cookie}`);
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      
      // First get CSRF token if we don't have one
      if (!csrfToken || csrfToken === 'No token received') {
        await testCsrfToken();
      }
      
      const response = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
          csrfToken: csrfToken,
        }),
      });
      
      const data = await response.json();
      setTestResult(`Login Response (${response.status}): ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Mobile Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
            <div><strong>Screen:</strong> {debugInfo.screenWidth} x {debugInfo.screenHeight}</div>
            <div><strong>Viewport:</strong> {debugInfo.viewportWidth} x {debugInfo.viewportHeight}</div>
            <div><strong>Cookie Enabled:</strong> {String(debugInfo.cookieEnabled)}</div>
            <div><strong>Platform:</strong> {debugInfo.platform}</div>
            <div><strong>Is Mobile:</strong> {String(debugInfo.isMobile)}</div>
            <div><strong>Is iOS:</strong> {String(debugInfo.isIOS)}</div>
            <div><strong>Is Android:</strong> {String(debugInfo.isAndroid)}</div>
            <div><strong>Origin:</strong> {debugInfo.origin}</div>
            <div><strong>Current URL:</strong> {debugInfo.href}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">{cookies}</pre>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button onClick={testCsrfToken} className="mr-2">Test CSRF Token</Button>
            <Button onClick={testLogin}>Test Login</Button>
          </div>
          {csrfToken && (
            <div>
              <strong>CSRF Token:</strong> <code className="text-xs">{csrfToken}</code>
            </div>
          )}
          {testResult && (
            <Alert>
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}