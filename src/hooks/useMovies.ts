/**
 * useMovies Hook
 * 
 * Manages movie data fetching and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { movieApi } from '@/lib/api-endpoints';
import { handleApiError } from '@/lib/api-client';
import type { Movie, MovieStatus, LoadingState } from '@/lib/types';

export interface UseMoviesOptions {
  status?: MovieStatus;
  limit?: number;
  offset?: number;
  search?: string;
  autoFetch?: boolean;
  enableCache?: boolean;
}

export interface UseMoviesReturn extends LoadingState {
  movies: Movie[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    hasMore: boolean;
  };
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => void;
}

// Simple in-memory cache
const movieCache = new Map<string, { data: Movie[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useMovies(options: UseMoviesOptions = {}): UseMoviesReturn {
  const {
    status,
    limit = 20,
    offset = 0,
    search,
    autoFetch = true,
    enableCache = true,
  } = options;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [pagination, setPagination] = useState({
    limit,
    offset,
    count: 0,
    hasMore: false,
  });

  // Create cache key
  const cacheKey = JSON.stringify({ status, search, limit, offset });

  // Check cache
  const getCachedData = useCallback(() => {
    if (!enableCache) return null;
    
    const cached = movieCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    movieCache.delete(cacheKey);
    return null;
  }, [cacheKey, enableCache]);

  // Set cache
  const setCachedData = useCallback((data: Movie[]) => {
    if (enableCache) {
      movieCache.set(cacheKey, { data, timestamp: Date.now() });
    }
  }, [cacheKey, enableCache]);

  const fetchMovies = useCallback(async (append = false) => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData && !append) {
      setMovies(cachedData);
      setLastUpdated(new Date());
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      let response;
      
      if (search) {
        // Use search API
        const searchResults = await movieApi.searchMovies(search);
        response = {
          success: true,
          data: searchResults,
          pagination: {
            limit,
            offset,
            count: searchResults.length,
            has_more: false,
          },
        };
      } else {
        // Use regular movie list API based on status
        if (status === 'showing') {
          response = await movieApi.getNowPlayingMovies();
        } else if (status === 'coming_soon') {
          response = await movieApi.getComingSoonMovies();
        } else {
          // Default to all movies
          response = await movieApi.getAllMovies();
        }
        
        // Convert to expected format
        response = {
          success: true,
          data: response,
          pagination: {
            limit,
            offset: 0,
            count: response.length,
            has_more: false,
          },
        };
      }

      if (response.success && response.data) {
        const newMovies = Array.isArray(response.data) ? response.data : [response.data];
        
        if (append) {
          setMovies(prevMovies => [...prevMovies, ...newMovies]);
        } else {
          setMovies(newMovies);
          setCachedData(newMovies);
        }

        if (response.pagination) {
          setPagination({
            limit: response.pagination.limit || limit,
            offset: response.pagination.offset || offset,
            count: response.pagination.count || newMovies.length,
            hasMore: response.pagination.has_more || false,
          });
        }

        setLastUpdated(new Date());
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to fetch movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status, search, limit, offset, getCachedData, setCachedData]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || isLoading) return;

    const newOffset = pagination.offset + pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset }));
    await fetchMovies(true);
  }, [pagination, isLoading, fetchMovies]);

  const refresh = useCallback(() => {
    // Clear cache and refetch
    if (enableCache) {
      movieCache.clear();
    }
    fetchMovies(false);
  }, [fetchMovies, enableCache]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    if (autoFetch) {
      fetchMovies(false);
    }
  }, [autoFetch, fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    lastUpdated,
    pagination,
    refetch: () => fetchMovies(false),
    loadMore,
    refresh,
  };
}

// Specialized hooks for common use cases
export function useNowPlayingMovies() {
  return useMovies({ 
    status: 'showing',
    autoFetch: true,
    enableCache: true,
  });
}

export function useComingSoonMovies() {
  return useMovies({ 
    status: 'coming_soon',
    autoFetch: true,
    enableCache: true,
  });
}

export function useMovieSearch(query: string) {
  return useMovies({
    search: query,
    autoFetch: !!query.trim(),
    enableCache: false, // Search results shouldn't be cached as aggressively
  });
}