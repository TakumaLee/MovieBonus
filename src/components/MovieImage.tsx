// 在客戶端動態創建圖片元素，完全繞過 Next.js 構建時處理
'use client';
import React, { useState, useRef, useEffect } from 'react';

interface MovieImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  'data-ai-hint'?: string;
  priority?: boolean;
}

export function MovieImage({ 
  src, 
  alt, 
  className, 
  'data-ai-hint': aiHint 
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 確保只在客戶端執行
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 只在客戶端且組件已掛載時執行
    if (!isMounted || !containerRef.current || typeof window === 'undefined') return;

    // 強制延遲確保完全在客戶端執行
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      // 清空容器
      containerRef.current.innerHTML = '';

      // 動態創建 img 元素
      const img = document.createElement('img');
      const finalSrc = imageSrc || 'https://placehold.co/400x600/gray/white?text=電影海報';
      
      img.src = finalSrc;
      img.alt = alt;
      img.loading = 'lazy';
      
      if (className) {
        img.className = className;
      }
      
      if (aiHint) {
        img.setAttribute('data-ai-hint', aiHint);
      }

      img.onerror = () => {
        if (!hasError) {
          setHasError(true);
          setImageSrc('https://placehold.co/400x600/gray/white?text=電影海報');
        }
      };

      // 插入動態創建的 img 元素
      containerRef.current.appendChild(img);
    }, 100); // 小延遲確保完全客戶端執行

    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isMounted, imageSrc, alt, className, aiHint, hasError]);

  // 服務器端渲染時顯示佔位符
  if (!isMounted) {
    return <div ref={containerRef} className="bg-muted animate-pulse" />;
  }

  return <div ref={containerRef} />;
}