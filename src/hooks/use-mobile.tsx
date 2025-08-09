import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      // Proper mobile detection with correct Safari handling
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for actual mobile devices (not iPads in desktop mode)
      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Check for mobile Safari (iPhone only, not iPad or desktop)
      const isIPhoneSafari = /iphone/.test(userAgent) && /safari/.test(userAgent);
      
      // Check for iPad in mobile viewport
      const isIPadMobile = /ipad/.test(userAgent) && window.innerWidth < MOBILE_BREAKPOINT;
      
      // Screen size check for responsive behavior
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;
      
      // Only treat as mobile if it's actually a mobile device OR small screen
      // Don't force desktop Safari or iPad in desktop mode to mobile
      const shouldBeMobile = isMobileDevice || isIPhoneSafari || isIPadMobile || isSmallScreen;
      
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