// 簡單圖片組件 - 完全繞過 Next.js 圖片優化
'use client';
import React, { useEffect, useRef } from 'react';

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  'data-ai-hint'?: string;
}

export function SimpleImage({ src, alt, className, loading = 'lazy', 'data-ai-hint': aiHint }: SimpleImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 強制設定圖片 src，確保不經過 Next.js 處理
    if (imgRef.current && src) {
      imgRef.current.src = src;
    }
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      alt={alt}
      className={className}
      loading={loading}
      data-ai-hint={aiHint}
      style={{ display: 'block' }}
      // 不設定 src 屬性，用 useEffect 動態設定
    />
  );
}