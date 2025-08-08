'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtag';
import { Movie, MoviePromotion } from '@/lib/types';

interface UseMovieAnalyticsProps {
  movie?: Movie;
  promotions?: MoviePromotion[];
  isLoading?: boolean;
}

export function useMovieAnalytics({ movie, promotions = [], isLoading }: UseMovieAnalyticsProps) {
  
  useEffect(() => {
    if (!movie || isLoading) return;

    // Track movie view with enhanced data
    const hasBonuses = promotions.length > 0;
    const bonusCount = promotions.length;
    
    trackEvent.movieView(
      movie.title,
      movie.id,
      hasBonuses,
      bonusCount
    );

    // Track SEO events
    trackEvent.seoEvents.metaTagGeneration(
      'movie_detail',
      !!(movie.seo_title || movie.seo_description || movie.seo_keywords?.length)
    );

    trackEvent.seoEvents.canonicalURL(!!movie.canonical_url);

    trackEvent.seoEvents.structuredDataImpression('movie', movie.title);

    // If there are promotions, track those too
    if (promotions.length > 0) {
      promotions.slice(0, 3).forEach(promotion => { // Limit to first 3 to avoid spam
        trackEvent.promotionView(
          promotion.title,
          movie.title,
          promotion.promotion_type
        );
      });
    }

  }, [movie, promotions, isLoading]);

  // Return tracking functions for manual use
  return {
    trackBonusView: (bonusTitle: string, bonusValue?: number) => {
      if (movie) {
        trackEvent.ecommerce.viewItem(movie.title, bonusTitle, bonusValue);
      }
    },
    
    trackBonusInterest: (bonusTitle: string) => {
      if (movie) {
        trackEvent.ecommerce.addToWishlist(movie.title, bonusTitle);
      }
    },

    trackExternalLink: (url: string, linkType?: 'movie_trailer' | 'cinema_link' | 'promotion_link') => {
      trackEvent.externalLink(url, linkType);
    }
  };
}