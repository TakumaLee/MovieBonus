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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [imageSrc, alt, className, aiHint, hasError]);

  return <div ref={containerRef} />;
}