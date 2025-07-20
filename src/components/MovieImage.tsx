// 專門處理電影圖片的組件
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { getPlaceholderUrl } from '@/lib/image-utils';

interface MovieImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  'data-ai-hint'?: string;
  priority?: boolean;
}

export function MovieImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  'data-ai-hint': aiHint,
  priority = false 
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(getPlaceholderUrl(width, height, '電影海報'));
    }
  };

  return (
    <Image
      src={imageSrc || getPlaceholderUrl(width, height, '電影海報')}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-ai-hint={aiHint}
      priority={priority}
      unoptimized={true}
      onError={handleError}
    />
  );
}