/**
 * API Endpoints Configuration
 * 
 * Defines all API endpoints for communicating with the backend Python API
 * All data from Supabase is accessed through these backend endpoints
 */

import { apiClient, ApiResponse, PaginatedResponse } from './api-client';
import type {
  Movie,
  MovieQueryParams,
  MoviePromotion,
  PromotionQueryParams,
  VieshowMoviesResponse,
  VieshowScrapeRequest,
  VieshowScrapeResponse,
  HealthCheckResponse,
  SaveMoviesRequest,
  SaveMoviesResponse,
  MovieBatchSearchRequest,
  MovieBatchSearchResponse,
  FacebookSinglePostRequest,
  FacebookSinglePostResponse,
  FacebookPromotionAnalysisRequest,
  FacebookPromotionAnalysisResponse,
  MovieBonusSaveRequest,
  MovieBonusSaveResponse,
} from './types';

// ============================================================================
// Core API Interface
// ============================================================================

export const api = {
  // 🎬 電影相關 API (通過後端存取 Supabase)
  movies: {
    // 獲取電影列表 (分頁)
    list: (params?: MovieQueryParams) =>
      apiClient.get<PaginatedResponse<Movie>>('/api/v1/supabase/movies', params),
    
    // 獲取單一電影詳情
    get: (movieId: string) =>
      apiClient.get<ApiResponse<Movie>>(`/api/v1/supabase/movies/${movieId}`),
    
    // 更新電影狀態
    updateStatus: (movieId: string, status: string) =>
      apiClient.put<ApiResponse<Movie>>(`/api/v1/supabase/movies/${movieId}/status`, { status }),
    
    // 儲存電影到 Supabase
    save: (movies: SaveMoviesRequest) =>
      apiClient.post<SaveMoviesResponse>('/api/v1/supabase/save-movies', movies),
    
    // 清理過期電影
    cleanup: (params?: { days_old?: number; status?: string }) =>
      apiClient.delete<ApiResponse<{ deleted_count: number; cleanup_summary: string }>>('/api/v1/supabase/movies/cleanup'),
  },

  // 🎁 電影特典/促銷 API
  promotions: {
    // 獲取特典列表
    list: (params?: PromotionQueryParams) =>
      apiClient.get<PaginatedResponse<MoviePromotion>>('/api/v1/movie-bonuses', params),
    
    // 獲取特定電影的特典
    getByMovieId: (movieId: string) =>
      apiClient.get<ApiResponse<MoviePromotion[]>>(`/api/v1/movie-bonuses/${movieId}`),
    
    // 儲存特典資料
    save: (request: MovieBonusSaveRequest) =>
      apiClient.post<MovieBonusSaveResponse>('/api/v1/movie-bonuses/direct-save', request),
    
    // 刪除特定特典
    delete: (promotionId: string) =>
      apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/api/v1/movie-bonuses/${promotionId}`),
  },

  // 🎭 威秀電影爬蟲 API
  vieshow: {
    // 獲取所有電影
    getAllMovies: () =>
      apiClient.get<VieshowMoviesResponse>('/api/v1/vieshow/movies/all'),
    
    // 獲取現正上映電影
    getShowingMovies: () =>
      apiClient.get<VieshowMoviesResponse>('/api/v1/vieshow/movies/showing'),
    
    // 獲取即將上映電影
    getComingMovies: () =>
      apiClient.get<VieshowMoviesResponse>('/api/v1/vieshow/movies/coming'),
    
    // 獲取單一電影詳情
    getMovieDetail: (movieId: string) =>
      apiClient.get<Movie>(`/api/v1/vieshow/movies/${movieId}`),
    
    // 執行爬蟲
    scrape: (request: VieshowScrapeRequest) =>
      apiClient.post<VieshowScrapeResponse>('/api/v1/vieshow/scrape', request),
    
    // 健康檢查
    health: () =>
      apiClient.get<HealthCheckResponse>('/api/v1/vieshow/health'),
  },

  // 🔍 電影搜尋 API
  search: {
    // 模糊搜尋
    fuzzy: (request: MovieBatchSearchRequest) =>
      apiClient.post<MovieBatchSearchResponse>('/api/v1/movie-search/fuzzy', request),
    
    // 搜尋建議
    suggest: (query: string, limit = 5) =>
      apiClient.get<ApiResponse<string[]>>('/api/v1/movie-search/suggest', { q: query, limit }),
    
    // 清除搜尋快取
    clearCache: () =>
      apiClient.delete<ApiResponse<{ cleared: boolean; timestamp: string }>>('/api/v1/movie-search/cache'),
    
    // 健康檢查
    health: () =>
      apiClient.get<HealthCheckResponse>('/api/v1/movie-search/health'),
  },

  // 📘 Facebook 爬蟲 API
  facebook: {
    // 展開所有文字
    expandText: (pageUrl: string) =>
      apiClient.post('/api/v1/facebook/expand-all-text', { page_url: pageUrl }),
    
    // 單一貼文爬蟲
    singlePost: (request: FacebookSinglePostRequest) =>
      apiClient.post<FacebookSinglePostResponse>('/api/v1/facebook/single-post', request),
    
    // 分析促銷資訊
    analyzePromotions: (request: FacebookPromotionAnalysisRequest) =>
      apiClient.post<FacebookPromotionAnalysisResponse>('/api/v1/facebook/analyze-promotions', request),
    
    // 提取電影特典
    extractMovieBonuses: (pageUrl: string, maxPosts = 50) =>
      apiClient.post('/api/v1/facebook/extract-movie-bonuses', { 
        page_url: pageUrl, 
        max_posts: maxPosts 
      }),
    
    // 健康檢查
    health: () =>
      apiClient.get<HealthCheckResponse>('/api/v1/facebook/promotions-health'),
  },

  // 🏥 系統狀態 API
  system: {
    // 主要健康檢查
    health: () =>
      apiClient.get<HealthCheckResponse>('/health'),
    
    // 系統架構資訊
    architecture: () =>
      apiClient.get('/api/v1/system/architecture'),
    
    // Supabase 健康檢查
    supabaseHealth: () =>
      apiClient.get<HealthCheckResponse>('/api/v1/supabase/health'),
  },

  // 🎭 影城資訊 API
  cinemas: {
    // 獲取所有影城
    list: () =>
      apiClient.get('/api/v1/supabase/cinemas'),
  },

  // 📊 爬蟲會話記錄 API
  sessions: {
    // 獲取爬蟲執行記錄
    list: () =>
      apiClient.get('/api/v1/supabase/scrape-sessions'),
  },
};

// ============================================================================
// Convenience Methods for Common Operations
// ============================================================================

export const movieApi = {
  // 獲取現正上映的電影（優先從 Supabase，fallback 到威秀爬蟲）
  async getNowPlayingMovies() {
    try {
      const response = await api.movies.list({ status: 'showing', limit: 50 });
      if (response.success && response.data && response.data.success && response.data.data) {
        // API client wraps the response, so we need response.data.data
        return response.data.data;
      }
    } catch (error) {
      console.warn('Failed to get movies from Supabase, trying Vieshow:', error);
    }
    
    // Fallback to Vieshow API
    const vieshowResponse = await api.vieshow.getShowingMovies();
    return vieshowResponse.success ? vieshowResponse.data?.movies || [] : [];
  },

  // 獲取即將上映的電影
  async getComingSoonMovies() {
    try {
      const response = await api.movies.list({ status: 'coming_soon', limit: 50 });
      if (response.success && response.data && response.data.success && response.data.data) {
        // API client wraps the response, so we need response.data.data
        return response.data.data;
      }
    } catch (error) {
      console.warn('Failed to get coming movies from Supabase, trying Vieshow:', error);
    }
    
    // Fallback to Vieshow API
    const vieshowResponse = await api.vieshow.getComingMovies();
    return vieshowResponse.success ? vieshowResponse.data?.movies || [] : [];
  },

  // 獲取所有電影
  async getAllMovies() {
    try {
      const response = await api.movies.list({ limit: 50 });
      if (response.success && response.data && response.data.success && response.data.data) {
        // API client wraps the response, so we need response.data.data
        return response.data.data;
      }
    } catch (error) {
      console.warn('Failed to get all movies from Supabase, trying Vieshow:', error);
    }
    
    // Fallback to Vieshow API
    const vieshowResponse = await api.vieshow.getAllMovies();
    return vieshowResponse.success ? vieshowResponse.data?.movies || [] : [];
  },

  // 獲取電影詳情和特典
  async getMovieWithBonuses(movieId: string) {
    try {
      // 獲取所有電影列表來找到對應的電影，因為單一電影查詢API有問題
      const showingResponse = await api.movies.list({ status: 'showing', limit: 100 });
      const comingSoonResponse = await api.movies.list({ status: 'coming_soon', limit: 100 });
      
      let allMovies: Movie[] = [];
      if (showingResponse.success && showingResponse.data && showingResponse.data.success && showingResponse.data.data) {
        allMovies = [...allMovies, ...showingResponse.data.data];
      }
      if (comingSoonResponse.success && comingSoonResponse.data && comingSoonResponse.data.success && comingSoonResponse.data.data) {
        allMovies = [...allMovies, ...comingSoonResponse.data.data];
      }

      // 找到對應的電影（使用 id - 我們的資料庫 UUID）
      const movie = allMovies.find(m => m.id === movieId) || null;

      // 從 movie-bonuses API 獲取所有電影的特典資料
      const bonusesResponse = await apiClient.get<{
        success: boolean;
        movies: Array<{
          movie_id: string;
          title: string;
          promotions: MoviePromotion[] | null;
        }>;
      }>('/api/v1/movie-bonuses?limit=200');

      let bonuses: MoviePromotion[] = [];
      if (bonusesResponse.success && bonusesResponse.data && bonusesResponse.data.success && bonusesResponse.data.movies) {
        // 在特典API中，movie_id 對應到我們電影的 id 欄位
        const movieWithBonuses = bonusesResponse.data.movies.find(m => m.movie_id === movieId);
        bonuses = movieWithBonuses?.promotions || [];
      }

      return { movie, bonuses };
    } catch (error) {
      console.error('Failed to get movie with bonuses:', error);
      return { movie: null, bonuses: [] };
    }
  },

  // 獲取所有電影的特典資訊（用於檢查是否有特典）
  async getAllMovieBonuses() {
    try {
      const response = await apiClient.get<{
        success: boolean;
        movies: Array<{
          movie_id: string;
          title: string;
          promotions: MoviePromotion[] | null;
        }>;
      }>('/api/v1/movie-bonuses?limit=200');
      
      if (response.success && response.data && response.data.success && response.data.movies) {
        // 創建一個 movieId -> hasBonuses 的映射
        const bonusesMap = new Map<string, boolean>();
        response.data.movies.forEach(movie => {
          bonusesMap.set(movie.movie_id, !!(movie.promotions && movie.promotions.length > 0));
        });
        return bonusesMap;
      }
      return new Map();
    } catch (error) {
      console.error('Failed to get movie bonuses:', error);
      return new Map();
    }
  },

  // 搜尋電影
  async searchMovies(query: string) {
    if (!query.trim()) {
      return [];
    }

    try {
      // 使用新的搜尋 API endpoint
      const response = await apiClient.get<any>('/api/v1/movie-search/suggest', { 
        q: query, 
        limit: 10 
      });
      
      if (response.success && response.data?.suggestions) {
        // 將搜尋建議轉換為 Movie 對象格式
        const searchResults = response.data.suggestions.map((suggestion: any) => ({
          id: suggestion.movie_id, // 使用 movie_id 作為 id
          movie_id: suggestion.movie_id,
          title: suggestion.title,
          english_title: suggestion.english_title,
          // 其他必要的 Movie 類型欄位可以設為默認值
          poster_url: '',
          release_date: '',
          status: 'unknown',
          score: suggestion.score,
          matched_field: suggestion.matched_field
        }));

        // 嘗試從完整電影資料中獲取 poster_url 和其他詳細資訊
        try {
          // 獲取所有電影資料以進行 poster URL 查找
          const moviesResponse = await api.movies.list({ limit: 1000 });
          
          if (moviesResponse.success && moviesResponse.data?.items) {
            const moviesMap = new Map();
            
            // 建立多種查找索引：movie_id、title、english_title
            moviesResponse.data.items.forEach((movie: any) => {
              // 使用 movie_id 作為主要索引
              if (movie.movie_id) {
                moviesMap.set(movie.movie_id, movie);
              }
              // 使用 title 作為備用索引（正規化處理）
              if (movie.title) {
                const normalizedTitle = movie.title.toLowerCase().trim();
                moviesMap.set(normalizedTitle, movie);
              }
              // 使用 english_title 作為備用索引
              if (movie.english_title) {
                const normalizedEnglishTitle = movie.english_title.toLowerCase().trim();
                moviesMap.set(normalizedEnglishTitle, movie);
              }
            });

            // 增強搜尋結果，添加 poster_url 和其他詳細資訊
            return searchResults.map(result => {
              // 嘗試多種方式查找匹配的電影
              let movieData = moviesMap.get(result.movie_id);
              
              if (!movieData && result.title) {
                movieData = moviesMap.get(result.title.toLowerCase().trim());
              }
              
              if (!movieData && result.english_title) {
                movieData = moviesMap.get(result.english_title.toLowerCase().trim());
              }

              // 如果找到匹配的電影資料，使用完整資料
              if (movieData) {
                return {
                  ...result,
                  poster_url: movieData.poster_url || '',
                  release_date: movieData.release_date || '',
                  status: movieData.status || 'unknown',
                  id: movieData.id || result.id, // 使用資料庫的真實 ID
                };
              }

              // 如果沒找到匹配，返回原始結果
              return result;
            });
          }
        } catch (lookupError) {
          console.warn('Failed to lookup poster URLs for search results:', lookupError);
          // 如果查找失敗，返回原始搜尋結果
        }

        return searchResults;
      }
    } catch (error) {
      console.error('Movie search failed:', error);
    }
    
    return [];
  },
};

export default api;