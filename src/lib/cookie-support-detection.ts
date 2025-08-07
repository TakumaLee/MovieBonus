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

  try {
    // Safari detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // For Safari, especially on iOS, assume limited cookie support in cross-origin context
    if (isSafari || isIOS) {
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
      
      // Only trust cookies in localhost for Safari
      if (!isLocalhost) {
        console.log('Safari detected in production, assuming limited cookie support');
        return false;
      }
    }
    
    // For other browsers, do a simple test
    const testName = '_cookie_test_' + Date.now();
    const testValue = 'test';
    
    // Set test cookie with simpler settings
    document.cookie = `${testName}=${testValue}; path=/`;
    
    // Check if cookie was set
    const cookieSet = document.cookie.includes(testName);
    
    // Clean up test cookie
    if (cookieSet) {
      document.cookie = `${testName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    
    return cookieSet;
  } catch (error) {
    console.error('Cookie support detection error:', error);
    // On error, assume no cookie support for safety
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