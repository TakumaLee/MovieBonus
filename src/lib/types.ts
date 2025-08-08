/**
 * TypeScript Type Definitions for MovieBonus Frontend
 * 
 * These types match the backend API response structures
 * and Supabase database schema
 */

// ============================================================================
// Core Database Types (matching Supabase schema)
// ============================================================================

export type MovieStatus = 'showing' | 'coming_soon' | 'ended';
export type GiftType = 'physical' | 'digital' | 'experience' | 'discount';
export type FormatType = 'digital' | 'imax' | '4dx' | 'vr' | 'titan' | 'mucrown';

// Movie entity
export interface Movie {
  id: string; // 資料庫主鍵 UUID（主要使用的識別符）
  movie_id: string; // 額外的電影標識符
  title: string;
  english_title?: string;
  vieshow_movie_id: string;
  status: MovieStatus;
  genre: string[];
  rating?: string; // 分級
  duration?: number; // 片長（分鐘）
  director: string[];
  movie_cast: string[]; // 注意：資料庫欄位名為 movie_cast
  synopsis?: string;
  release_date?: string;
  end_date?: string;
  poster_url?: string;
  trailer_url?: string;
  gallery: string[];
  // Bonus information (populated by API)
  has_bonuses?: boolean;
  bonus_count?: number;
  // SEO fields (new fields from backend SEO implementation)
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_title?: string;
  og_description?: string;
  canonical_url?: string;
  created_at: string;
  updated_at: string;
}

// Movie promotion/bonus entity
export interface MoviePromotion {
  id: string;
  movie_id: string;
  promotion_type: string;
  title: string;
  description?: string;
  release_date?: string;
  end_date?: string;
  acquisition_method?: string;
  terms_and_conditions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Related data
  gifts?: PromotionGift[];
}

// Promotion gift entity
export interface PromotionGift {
  id: string;
  promotion_id: string;
  gift_name: string;
  gift_type?: GiftType;
  gift_description?: string;
  gift_image_url?: string;
  quantity?: number;
  per_person_limit: number;
  estimated_value?: number;
  is_exclusive: boolean;
  created_at: string;
  updated_at: string;
}

// Cinema entity
export interface Cinema {
  id: string;
  cinema_id: string;
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  features: string[]; // ['IMAX', '4DX', 'VR', 'GOLD CLASS']
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Scrape session entity
export interface ScrapeSession {
  id: string;
  session_type: 'all' | 'showing' | 'coming';
  start_time: string;
  end_time?: string;
  total_movies_scraped: number;
  total_pages_scraped: number;
  status: string;
  error_message?: string;
  created_at: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    has_more: boolean;
  };
}

// Movie query parameters
export interface MovieQueryParams {
  status?: MovieStatus;
  limit?: number;
  offset?: number;
  search?: string;
  vieshow_movie_id?: string;
}

// Promotion query parameters
export interface PromotionQueryParams {
  status?: 'active' | 'inactive' | 'expired';
  movie_id?: string;
  promotion_type?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Vieshow API Types
// ============================================================================

export interface VieshowMoviesResponse {
  success: boolean;
  message: string;
  scraped_count: number;
  page_info: {
    current_page: number;
    total_pages: number;
    movies_per_page: number;
  };
  execution_time: number;
  movies: Movie[];
  session_id?: string;
}

export interface VieshowScrapeRequest {
  target?: 'all' | 'showing' | 'coming';
  page_limit?: number;
  force_refresh?: boolean;
  save_to_supabase?: boolean;
}

export interface VieshowScrapeResponse {
  success: boolean;
  message: string;
  scraped_count: number;
  page_info: {
    current_page: number;
    total_pages: number;
    movies_per_page: number;
  };
  execution_time: number;
  movies: Movie[];
  session_id?: string;
}

// ============================================================================
// Movie Search Types
// ============================================================================

export interface MovieSearchQuery {
  title: string;
  search_type?: 'exact' | 'fuzzy' | 'smart';
  min_similarity?: number;
  max_results?: number;
}

export interface MovieBatchSearchRequest {
  queries: MovieSearchQuery[];
  return_all_if_no_match?: boolean;
}

export interface MovieSearchResult {
  query_title: string;
  matched_movies: Movie[];
  search_method: string;
  similarity_scores: number[];
  processing_time: number;
}

export interface MovieBatchSearchResponse {
  success: boolean;
  message: string;
  total_queries: number;
  total_matches: number;
  results: MovieSearchResult[];
  processing_time: number;
}

// ============================================================================
// Facebook API Types
// ============================================================================

export interface FacebookSinglePostRequest {
  post_url: string;
  extract_comments?: boolean;
  max_execution_time?: number;
}

export interface FacebookPostData {
  id: string;
  content: string;
  length: number;
  type: string;
  keywords: string[];
  features: {
    hasLinks: boolean;
    hasHashtags: boolean;
    hasPrice: boolean;
    hasDate: boolean;
  };
}

export interface FacebookSinglePostResponse {
  status: 'success' | 'error';
  post_url: string;
  post_data?: FacebookPostData;
  execution_time: number;
  message?: string;
}

export interface FacebookPromotionAnalysisRequest {
  page_url: string;
  save_to_supabase?: boolean;
  max_posts?: number;
}

export interface FacebookPromotionAnalysisResponse {
  status: 'success' | 'error';
  page_url: string;
  total_posts_analyzed: number;
  movies_found: number;
  promotions_matched: any[];
  analysis_summary: any;
  supabase_saved: boolean;
  processing_time: number;
}

// ============================================================================
// Movie Bonuses Types
// ============================================================================

export interface MovieBonusSaveRequest {
  bonuses: MovieBonusData[];
  source_info?: {
    platform: string;
    url: string;
    extraction_date: string;
  };
}

export interface MovieBonusData {
  id: string;
  movie_name: string;
  bonuses: string[];
  acquisition_method: string;
  release_date: string;
  notes: string;
  post_type: string;
  original_content: string;
}

export interface MovieBonusSaveResponse {
  success: boolean;
  message: string;
  total_bonuses: number;
  successful_saves: number;
  failed_saves: number;
  processing_time: number;
  saved_bonuses: Array<{
    movie_name: string;
    movie_id?: string;
    vieshow_movie_id?: string;
    promotion_id: string;
    bonuses_saved: number;
    matched_method: string;
    confidence_score: number;
  }>;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services?: {
    database?: 'up' | 'down';
    cache?: 'up' | 'down';
    external_apis?: 'up' | 'down';
  };
  version?: string;
  service?: string;
  features?: string[];
}

// ============================================================================
// Save Movies Types
// ============================================================================

export interface SaveMoviesRequest {
  movies: Movie[];
  session_type?: string;
  force_update?: boolean;
  create_session?: boolean;
}

export interface SaveMoviesResponse {
  success: boolean;
  message: string;
  session_id?: string;
  total_movies: number;
  successful_saves: number;
  failed_saves: number;
  new_movies: number;
  updated_movies: number;
  execution_time: number;
  errors: Array<{ [key: string]: any }>;
}

// ============================================================================
// Frontend-Specific Types (UI State Management)
// ============================================================================

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

// Movie card display data
export interface MovieCardData {
  id: string;
  title: string;
  posterUrl: string;
  hasBonus: boolean;
  status: MovieStatus;
  releaseDate?: string;
}

// Movie detail page data
export interface MovieDetailData extends Movie {
  bonuses: MoviePromotion[];
  isLoading?: boolean;
  error?: string;
}

// Search state
export interface SearchState {
  query: string;
  results: Movie[];
  isSearching: boolean;
  suggestions: string[];
  history: string[];
}

// App state
export interface AppState {
  currentUser?: any; // 暫時未實作認證
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en-US';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// ============================================================================
// Legacy Types (for backward compatibility with existing AI flow)
// ============================================================================

export interface CurateMovieBonusesInput {
  movieTitle: string;
}

export interface CurateMovieBonusesOutput {
  bonuses: Array<{
    bonusName: string;
    description: string;
    imageUrl: string;
    distributionPeriod: string;
    rules: string;
  }>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};

export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInput<T> = Partial<CreateInput<T>>;

// Form validation types
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncState<T> {
  data?: T;
  status: AsyncStatus;
  error?: string;
}

export default {};