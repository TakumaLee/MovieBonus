/**
 * Cookie Support Detection Utility
 * Detects if the browser supports third-party cookies
 */

export async function detectCookieSupport(): Promise<boolean> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return true; // Assume support on server side
  }

  // Basic cookie support check
  if (!navigator.cookieEnabled) {
    return false;
  }

  // Test third-party cookie support
  try {
    // Create a test cookie
    const testName = '_cookie_test_' + Date.now();
    const testValue = 'test';
    
    // Set test cookie
    document.cookie = `${testName}=${testValue}; path=/; SameSite=None; Secure`;
    
    // Check if cookie was set
    const cookieSet = document.cookie.includes(testName);
    
    // Clean up test cookie
    if (cookieSet) {
      document.cookie = `${testName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    
    // Additional check for iOS Safari
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS Safari has stricter cookie policies
      // Check if we're in a cross-origin context
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
      const isSameOrigin = window.location.hostname === new URL(process.env.NEXT_PUBLIC_NODE_API_URL || '').hostname;
      
      if (!isLocalhost && !isSameOrigin) {
        // Likely to have cookie issues in cross-origin context on iOS
        return false;
      }
    }
    
    return cookieSet;
  } catch (error) {
    console.error('Cookie support detection error:', error);
    return false;
  }
}

export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export async function getClientCapabilities() {
  const cookieSupport = await detectCookieSupport();
  const isMobile = isMobileBrowser();
  
  return {
    cookieSupport,
    isMobile,
    requiresFallback: isMobile && !cookieSupport,
    userAgent: navigator.userAgent
  };
}