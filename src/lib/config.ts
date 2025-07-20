/**
 * Application Configuration
 * 
 * Centralized configuration management for the MovieBonus frontend
 */

export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  },

  // Application Information
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || '特典速報',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },

  // Feature Flags
  features: {
    enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH === 'true',
    enableCache: process.env.NEXT_PUBLIC_ENABLE_CACHE === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },

  // Cache Settings
  cache: {
    movieListTTL: 5 * 60 * 1000, // 5 minutes
    movieDetailTTL: 10 * 60 * 1000, // 10 minutes
    promotionsTTL: 15 * 60 * 1000, // 15 minutes
    searchResultsTTL: 2 * 60 * 1000, // 2 minutes
  },

  // UI Settings
  ui: {
    itemsPerPage: 20,
    maxSearchSuggestions: 5,
    maxSearchHistory: 10,
    debounceDelay: 300,
  },

  // Development helpers
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
} as const;

export default config;