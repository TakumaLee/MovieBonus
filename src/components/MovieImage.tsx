// 專門處理電影圖片的組件
'use client';
import React, { useState } from 'react';

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

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('https://placehold.co/400x600/gray/white?text=電影海報');
    }
  };

  return (
    <img
      src={imageSrc || 'https://placehold.co/400x600/gray/white?text=電影海報'}
      alt={alt}
      className={className}
      data-ai-hint={aiHint}
      onError={handleError}
    />
  );
}