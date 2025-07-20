/**
 * useMovieDetail Hook
 * 
 * Manages individual movie detail fetching with bonuses
 */

import { useState, useEffect, useCallback } from 'react';
import { movieApi } from '@/lib/api-endpoints';
import { handleApiError } from '@/lib/api-client';
import type { Movie, MoviePromotion, LoadingState } from '@/lib/types';

export interface UseMovieDetailOptions {
  movieId?: string;
  autoFetch?: boolean;
  enableCache?: boolean;
}

export interface UseMovieDetailReturn extends LoadingState {
  movie: Movie | null;
  bonuses: MoviePromotion[];
  hasBonuses: boolean;
  refetch: () => Promise<void>;
  refresh: () => void;
}

// Cache for movie details
const movieDetailCache = new Map<string, { 
  movie: Movie | null; 
  bonuses: MoviePromotion[]; 
  timestamp: number; 
}>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function useMovieDetail(options: UseMovieDetailOptions = {}): UseMovieDetailReturn {
  const { movieId, autoFetch = true, enableCache = true } = options;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [bonuses, setBonuses] = useState<MoviePromotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date>();

  // Check cache
  const getCachedData = useCallback(() => {
    if (!enableCache || !movieId) return null;
    
    const cached = movieDetailCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached;
    }
    
    movieDetailCache.delete(movieId);
    return null;
  }, [movieId, enableCache]);

  // Set cache
  const setCachedData = useCallback((movieData: Movie | null, bonusData: MoviePromotion[]) => {
    if (enableCache && movieId) {
      movieDetailCache.set(movieId, { 
        movie: movieData, 
        bonuses: bonusData, 
        timestamp: Date.now() 
      });
    }
  }, [movieId, enableCache]);

  const fetchMovieDetail = useCallback(async () => {
    if (!movieId) {
      setMovie(null);
      setBonuses([]);
      return;
    }

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setMovie(cachedData.movie);
      setBonuses(cachedData.bonuses);
      setLastUpdated(new Date());
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const { movie: movieData, bonuses: bonusData } = await movieApi.getMovieWithBonuses(movieId);

      setMovie(movieData);
      setBonuses(bonusData || []);
      setCachedData(movieData, bonusData || []);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setMovie(null);
      setBonuses([]);
      console.error('Failed to fetch movie detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [movieId, getCachedData, setCachedData]);

  const refresh = useCallback(() => {
    // Clear cache and refetch
    if (enableCache && movieId) {
      movieDetailCache.delete(movieId);
    }
    fetchMovieDetail();
  }, [movieId, enableCache, fetchMovieDetail]);

  // Auto-fetch when movieId changes
  useEffect(() => {
    if (autoFetch) {
      fetchMovieDetail();
    }
  }, [autoFetch, fetchMovieDetail]);

  return {
    movie,
    bonuses,
    hasBonuses: bonuses.length > 0,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchMovieDetail,
    refresh,
  };
}

// Global cache for movie bonuses mapping
let bonusesMapCache: Map<string, boolean> | null = null;
let bonusesMapTimestamp = 0;
const BONUSES_MAP_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper hook for checking if a movie has bonuses (lighter weight)
export function useMovieHasBonuses(movieId?: string): boolean {
  const [hasBonuses, setHasBonuses] = useState(false);

  useEffect(() => {
    if (!movieId) {
      setHasBonuses(false);
      return;
    }

    // Check detail cache first
    const cached = movieDetailCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setHasBonuses(cached.bonuses.length > 0);
      return;
    }

    // Check bonuses map cache
    if (bonusesMapCache && Date.now() - bonusesMapTimestamp < BONUSES_MAP_CACHE_TTL) {
      setHasBonuses(bonusesMapCache.get(movieId) || false);
      return;
    }

    // Fetch all movie bonuses mapping
    movieApi.getAllMovieBonuses()
      .then((bonusesMap) => {
        bonusesMapCache = bonusesMap;
        bonusesMapTimestamp = Date.now();
        setHasBonuses(bonusesMap.get(movieId) || false);
      })
      .catch(() => setHasBonuses(false));
  }, [movieId]);

  return hasBonuses;
}