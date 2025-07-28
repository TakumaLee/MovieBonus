'use client';

import { useState, useEffect } from 'react';

export default function AdminLoginDebugPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [csrfToken, setCsrfToken] = useState('');
  const [log, setLog] = useState<string[]>([]);
  
  const addLog = (msg: string) => {
    setLog(prev => [...prev, `[${new Date().toISOString()}] ${msg}`]);
  };

  useEffect(() => {
    // Get CSRF token on mount
    addLog('Getting CSRF token...');
    const apiUrl = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000';
    addLog(`API URL: ${apiUrl}`);
    addLog('Using TEST endpoint to bypass rate limiting');
    
    fetch(`${apiUrl}/api/admin/test/csrf-token`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    })
    .then(async res => {
      addLog(`CSRF Response Status: ${res.status}`);
      addLog(`CSRF Response Headers: ${JSON.stringify(Object.fromEntries(res.headers))}`);
      const data = await res.json();
      addLog(`CSRF Response Data: ${JSON.stringify(data)}`);
      if (data.success && data.csrfToken) {
        setCsrfToken(data.csrfToken);
        addLog(`CSRF Token set: ${data.csrfToken}`);
      }
    })
    .catch(err => {
      addLog(`CSRF Error: ${err.message}`);
    });
  }, []);

  const handleLogin = async () => {
    addLog('Starting login...');
    addLog(`Email: ${email}`);
    addLog(`CSRF Token: ${csrfToken}`);
    
    const apiUrl = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000';
    
    try {
      const response = await fetch(`${apiUrl}/api/admin/test/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          csrfToken
        })
      });
      
      addLog(`Login Response Status: ${response.status}`);
      addLog(`Login Response Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
      
      const data = await response.json();
      addLog(`Login Response Data: ${JSON.stringify(data)}`);
      
    } catch (error: any) {
      addLog(`Login Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Login Debug</h1>
      
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleLogin}
          disabled={!csrfToken}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Login
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Debug Log:</h2>
        <pre className="text-xs whitespace-pre-wrap">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}