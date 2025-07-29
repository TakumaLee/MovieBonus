/**
 * API Client for MovieBonus Frontend
 * 
 * This client communicates with the backend Python API at port 8080
 * All Supabase data is accessed through the backend API, not directly
 */

// ============================================================================
// Base API Client Configuration
// ============================================================================

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

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    // Backend Python API URL (default to localhost for development)
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.timeout = 30000; // 30 seconds timeout
    
    // Log the API URL in development for debugging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Client] Using API URL:', this.baseURL);
      console.log('[API Client] Environment:', process.env.NODE_ENV);
      console.log('[API Client] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Remove credentials: 'include' to fix CORS issues with wildcard origin
      // credentials: 'include', // Include cookies for authentication
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `HTTP ${response.status}` };
        }

        throw new ApiError(
          Array.isArray(errorData.detail) 
            ? errorData.detail.map((e: any) => e.msg).join(', ')
            : errorData.detail || errorData.message || 'Unknown error',
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.makeRequest<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// ============================================================================
// Error Handling Utilities
// ============================================================================

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return '請求參數錯誤，請檢查輸入資料';
      case 401:
        return '未授權，請重新登入';
      case 403:
        return '沒有權限執行此操作';
      case 404:
        return '找不到請求的資源';
      case 408:
        return '請求超時，請重試';
      case 422:
        return '資料驗證失敗，請檢查輸入格式';
      case 429:
        return '請求過於頻繁，請稍後再試';
      case 500:
        return '伺服器內部錯誤，請稍後重試';
      case 502:
        return '伺服器無法回應，請稍後重試';
      case 503:
        return '服務暫時無法使用，請稍後重試';
      default:
        return error.message || '未知錯誤';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '發生未知錯誤';
};

// ============================================================================
// Retry Mechanism
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryCondition?: (error: ApiError) => boolean;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = (error) => error.status ? error.status >= 500 : true
  } = options;

  let lastError: ApiError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : 'Unknown error'
      );

      if (attempt === maxRetries || !retryCondition(lastError)) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};