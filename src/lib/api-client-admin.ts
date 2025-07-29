/**
 * API Client for Admin Routes
 * 
 * This client connects to the Node.js backend admin API
 * It handles CSRF protection and session management
 */

export interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  csrfToken?: string;
  retryAfter?: number;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

class AdminApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    // Use Node.js backend URL
    // In production, use the Cloud Run URL
    // In development, use localhost
    const isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = isProduction 
      ? 'https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app'
      : (process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000');
    this.timeout = 30000; // 30 seconds timeout
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AdminApiResponse<T>> {
    // Construct full URL with Node.js backend
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important: include cookies for session management
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
          errorData = { error: errorText || `HTTP ${response.status}` };
        }

        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          // Check if we're already on the login page to avoid redirect loop
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
            // Store the current path for redirect after login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/admin/login';
          }
        }

        throw new AdminApiError(
          errorData.error || errorData.message || 'Unknown error',
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AdminApiError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AdminApiError('Request timeout', 408);
      }
      
      throw new AdminApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<AdminApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<AdminApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<AdminApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<AdminApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const adminApiClient = new AdminApiClient();

// Admin API endpoints - pointing to Node.js backend
export const adminApi = {
  // Authentication
  auth: {
    getCsrfToken: () => adminApiClient.get('/api/admin/csrf-token'),
    login: (email: string, password: string, csrfToken: string) => 
      adminApiClient.post('/api/admin/login', { email, password, csrfToken }),
    logout: () => adminApiClient.post('/api/admin/logout'),
    verify: () => adminApiClient.get('/api/admin/verify'),
    forgotPassword: (email: string) => 
      adminApiClient.post('/api/admin/forgot-password', { email }),
    verifyResetToken: (token: string) => 
      adminApiClient.get(`/api/admin/reset-password/verify?token=${token}`),
    resetPassword: (token: string, newPassword: string) =>
      adminApiClient.post('/api/admin/reset-password', { token, newPassword }),
  },
  
  // Profile management
  profile: {
    get: () => adminApiClient.get('/api/admin/profile'),
    update: (data: any) => adminApiClient.put('/api/admin/profile', data),
    changePassword: (currentPassword: string, newPassword: string) =>
      adminApiClient.put('/api/admin/profile/password', { currentPassword, newPassword }),
  },
  
  // User management
  users: {
    list: () => adminApiClient.get('/api/admin/users'),
    get: (id: string) => adminApiClient.get(`/api/admin/users/${id}`),
    update: (id: string, data: any) => adminApiClient.put(`/api/admin/users/${id}`, data),
    delete: (id: string) => adminApiClient.delete(`/api/admin/users/${id}`),
    invite: (email: string, name: string) => 
      adminApiClient.post('/api/admin/users/invite', { email, name }),
  },
  
  // Stats and dashboard
  stats: {
    get: () => adminApiClient.get('/api/admin/stats'),
  },
  
  // Feedbacks management
  feedbacks: {
    list: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return adminApiClient.get(`/api/admin/feedbacks${queryString}`);
    },
    get: (id: string) => adminApiClient.get(`/api/admin/feedbacks/${id}`),
    update: (id: string, data: any) => adminApiClient.put(`/api/admin/feedbacks/${id}`, data),
    processLink: (feedbackId: string, data: any) => 
      adminApiClient.post(`/api/admin/feedbacks/${feedbackId}/process-link`, data),
    saveBonusData: (feedbackId: string, bonusData: any) =>
      adminApiClient.post(`/api/admin/feedbacks/${feedbackId}/save-bonus`, bonusData),
  },
  
  // Movies management
  movies: {
    list: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return adminApiClient.get(`/api/admin/movies${queryString}`);
    },
    get: (id: string) => adminApiClient.get(`/api/admin/movies/${id}`),
    search: (query: string) => adminApiClient.get(`/api/admin/movies/search?q=${encodeURIComponent(query)}`),
    
    // Movie promotions/bonuses management
    promotions: {
      list: (movieId: string) => adminApiClient.get(`/api/admin/movies/${movieId}/promotions`),
      get: (movieId: string, promotionId: string) => 
        adminApiClient.get(`/api/admin/movies/${movieId}/promotions/${promotionId}`),
      create: (movieId: string, data: any) => 
        adminApiClient.post(`/api/admin/movies/${movieId}/promotions`, data),
      update: (movieId: string, promotionId: string, data: any) => 
        adminApiClient.put(`/api/admin/movies/${movieId}/promotions/${promotionId}`, data),
      delete: (movieId: string, promotionId: string) => 
        adminApiClient.delete(`/api/admin/movies/${movieId}/promotions/${promotionId}`),
      toggleStatus: (movieId: string, promotionId: string) =>
        adminApiClient.post(`/api/admin/movies/${movieId}/promotions/${promotionId}/toggle-status`),
    },
  },
};