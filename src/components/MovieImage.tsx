// 專門處理電影圖片的組件 - 使用 dangerouslySetInnerHTML 完全繞過 Next.js 圖片處理
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
    if (containerRef.current) {
      const img = containerRef.current.querySelector('img');
      if (img) {
        img.onerror = () => {
          if (!hasError) {
            setHasError(true);
            setImageSrc('https://placehold.co/400x600/gray/white?text=電影海報');
          }
        };
      }
    }
  }, [imageSrc, hasError]);

  const finalSrc = imageSrc || 'https://placehold.co/400x600/gray/white?text=電影海報';
  
  const imgHtml = `<img 
    src="${finalSrc}" 
    alt="${alt}" 
    class="${className || ''}" 
    ${aiHint ? `data-ai-hint="${aiHint}"` : ''}
  />`;

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: imgHtml }}
    />
  );
}