# MovieBonus Frontend

Taiwan movie showtimes and bonuses tracking system frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎬 Movie listings with real-time data from backend API
- 🎁 Movie bonuses and promotional gifts tracking
- 📱 Responsive design with mobile-first approach
- ⚡ Fast loading with optimized caching
- 🔍 Advanced search functionality
- 🎨 Modern UI with shadcn/ui components
- 🚀 Optimized for Vercel deployment

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:9002` to see the application.

### Environment Variables

Create `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

## Project Structure

```
src/
├── app/                    # Next.js 15 app router
│   ├── movie/[movieId]/   # Movie detail pages
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── useMovies.ts      # Movie data management
│   ├── useMovieDetail.ts # Movie detail management
│   └── useSearch.ts      # Search functionality
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API client infrastructure
│   ├── api-endpoints.ts  # API endpoints wrapper
│   ├── types.ts          # TypeScript type definitions
│   └── config.ts         # Application configuration
└── styles/               # Global styles
```

## API Integration

The frontend communicates with the Python FastAPI backend running on port 8080:

- `/api/v1/supabase/movies` - Movie listings
- `/api/v1/supabase/movies/{id}` - Movie details
- `/api/v1/supabase/promotions` - Movie promotions
- `/api/v1/search/movies` - Movie search

## Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - Backend API URL
   - `NEXT_PUBLIC_ENVIRONMENT` - `production`
   - `NEXT_PUBLIC_DEBUG` - `false`
4. Deploy automatically

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Development Commands

```bash
# Development server with turbopack
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```

## Backend Integration

Ensure the backend services are running:

```bash
# Start Python scrapers (port 8080)
cd ../../backend/python-scrapers
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

## Features Overview

### Movie Listings
- Now Playing movies with real-time data
- Coming Soon movies preview
- Movie status badges and bonus indicators
- Responsive grid layout

### Movie Details
- Comprehensive movie information
- Cast and crew details
- Synopsis and movie metadata
- Promotional bonuses and gifts

### Search Functionality
- Real-time movie search
- Search suggestions and history
- Fuzzy matching for movie titles

### Error Handling
- Graceful API error handling
- Loading states and skeletons
- Retry mechanisms for failed requests
- Connection status indicators

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context
- **HTTP Client**: Fetch API with custom wrapper
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel

## Performance Optimizations

- Client-side caching for API responses
- Image optimization with Next.js Image
- Lazy loading for movie grids
- Debounced search queries
- Skeleton loading states

## Environment Support

- **Development**: `http://localhost:8080` backend
- **Production**: Configurable backend URL
- **Debug Mode**: Conditional logging and error details

## Contributing

1. Follow TypeScript strict mode
2. Use existing UI components from shadcn/ui
3. Implement proper error handling
4. Add loading states for async operations
5. Test with both local and remote backend APIs

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on port 8080
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify CORS settings in backend

2. **Build Errors**
   - Run `npm run typecheck` to find TypeScript errors
   - Check for missing dependencies
   - Verify environment variables are set

3. **Vercel Deployment Issues**
   - Ensure all environment variables are configured
   - Check build logs for specific errors
   - Verify API URL is accessible from Vercel

For more help, check the backend API documentation and CLAUDE.md file.
