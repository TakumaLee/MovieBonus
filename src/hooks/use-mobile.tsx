import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      // Enhanced mobile detection including Safari iOS specific checks
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSafariMobile = /safari/.test(userAgent) && /mobile/.test(userAgent);
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;
      
      // Safari iOS specific detection
      const isIOS = /ipad|iphone|ipod/.test(userAgent);
      const isSafariIOS = isIOS && /safari/.test(userAgent);
      
      // Force mobile layout for Safari iOS regardless of screen size
      const shouldBeMobile = isMobileUserAgent || isSafariMobile || isSafariIOS || isSmallScreen;
      
      setIsMobile(shouldBeMobile);
    }

    // Initial check
    checkDevice();

    // Listen for resize events
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkDevice()
    
    mql.addEventListener("change", onChange)
    window.addEventListener("resize", checkDevice)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return !!isMobile
}