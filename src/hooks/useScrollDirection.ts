'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollState {
  isVisible: boolean;
  isAtTop: boolean;
  scrollY: number;
}

interface UseScrollDirectionOptions {
  threshold?: number;        // Minimum scroll distance to trigger hide/show
  scrollUpThreshold?: number; // How much to scroll up before showing
  offset?: number;           // Distance from top before hiding starts
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const {
    threshold = 5,
    scrollUpThreshold = 10,
    offset = 0
  } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    isVisible: true,
    isAtTop: true,
    scrollY: 0
  });

  const [lastScrollY, setLastScrollY] = useState(0);
  const [accumulatedScroll, setAccumulatedScroll] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDiff = currentScrollY - lastScrollY;
    const isAtTop = currentScrollY <= offset;

    // If at the top of the page, always show
    if (isAtTop) {
      setScrollState({
        isVisible: true,
        isAtTop: true,
        scrollY: currentScrollY
      });
      setAccumulatedScroll(0);
      setLastScrollY(currentScrollY);
      return;
    }

    // Ignore small scroll movements
    if (Math.abs(scrollDiff) < threshold) {
      return;
    }

    // Scrolling down
    if (scrollDiff > 0) {
      setScrollState(prev => ({
        ...prev,
        isVisible: false,
        isAtTop: false,
        scrollY: currentScrollY
      }));
      setAccumulatedScroll(0);
    } 
    // Scrolling up
    else {
      const newAccumulated = accumulatedScroll + Math.abs(scrollDiff);
      setAccumulatedScroll(newAccumulated);
      
      // Show navbar after scrolling up enough
      if (newAccumulated >= scrollUpThreshold) {
        setScrollState(prev => ({
          ...prev,
          isVisible: true,
          isAtTop: false,
          scrollY: currentScrollY
        }));
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, accumulatedScroll, threshold, scrollUpThreshold, offset]);

  useEffect(() => {
    // Initialize scroll position
    const initialScrollY = window.scrollY;
    setLastScrollY(initialScrollY);
    setScrollState({
      isVisible: true,
      isAtTop: initialScrollY <= offset,
      scrollY: initialScrollY
    });

    // Throttle function for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll, offset]);

  return scrollState;
}