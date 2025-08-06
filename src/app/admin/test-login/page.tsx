'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@moviebonus.com');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const addResult = (step: string, data: any) => {
    setResults(prev => [...prev, { step, data, time: new Date().toISOString() }]);
  };

  const testLogin = async () => {
    setResults([]);
    
    try {
      // Step 1: Get CSRF Token
      addResult('1. Getting CSRF Token', { status: 'started' });
      
      const csrfResponse = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const csrfHeaders = Object.fromEntries(csrfResponse.headers.entries());
      const csrfData = await csrfResponse.json();
      
      addResult('1. CSRF Token Response', {
        status: csrfResponse.status,
        headers: csrfHeaders,
        data: csrfData,
        cookies: document.cookie,
      });
      
      if (!csrfData.csrfToken) {
        throw new Error('No CSRF token received');
      }
      
      // Step 2: Attempt Login
      addResult('2. Attempting Login', { 
        email,
        csrfToken: csrfData.csrfToken,
        sessionId: csrfData.sessionId,
      });
      
      const loginBody = JSON.stringify({
        email,
        password,
        csrfToken: csrfData.csrfToken,
        sessionId: csrfData.sessionId, // Include sessionId as fallback
      });
      
      const loginResponse = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: loginBody,
      });
      
      const loginHeaders = Object.fromEntries(loginResponse.headers.entries());
      const loginData = await loginResponse.json();
      
      addResult('2. Login Response', {
        status: loginResponse.status,
        headers: loginHeaders,
        data: loginData,
        requestBody: JSON.parse(loginBody),
        cookies: document.cookie,
      });
      
    } catch (error: any) {
      addResult('Error', {
        message: error.message,
        stack: error.stack,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Test Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button onClick={testLogin} disabled={!password}>
            Test Login
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.map((result, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-0">
                <h3 className="font-semibold mb-2">{result.step}</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
                <p className="text-xs text-gray-500 mt-1">{result.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}