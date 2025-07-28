'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress MetaMask errors
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes('MetaMask') || 
          event.message?.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
          event.message?.includes('Failed to connect to MetaMask') ||
          event.error?.stack?.includes('chrome-extension://')) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('MetaMask') ||
          event.reason?.message?.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
          event.reason?.message?.includes('Failed to connect to MetaMask') ||
          event.reason?.stack?.includes('chrome-extension://')) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', rejectionHandler, true);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('error', errorHandler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler, true);
    };
  }, []);

  return <>{children}</>;
}