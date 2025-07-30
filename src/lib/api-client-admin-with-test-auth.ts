/**
 * Modified Admin API Client with Test Authentication
 * 
 * This is a temporary solution for development/testing
 * It adds a test authentication token to all requests
 */

import { adminApiClient as originalClient, adminApi as originalApi } from './api-client-admin';

// Override the makeRequest method to add test authentication
const originalMakeRequest = originalClient['makeRequest'].bind(originalClient);

// Patch the client to add test authentication
(originalClient as any).makeRequest = async function(endpoint: string, options: RequestInit = {}) {
  // Add test authentication cookie to all requests
  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Cookie': 'test-admin-token=development-test-token-2025',
    },
  };
  
  return originalMakeRequest(endpoint, modifiedOptions);
};

// Export the patched client and API
export { originalClient as adminApiClient, originalApi as adminApi };