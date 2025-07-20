// 簡單圖片組件 - 完全繞過 Next.js 圖片優化
import React from 'react';

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  'data-ai-hint'?: string;
}

export function SimpleImage({ src, alt, className, loading = 'lazy', 'data-ai-hint': aiHint }: SimpleImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      data-ai-hint={aiHint}
    />
  );
}