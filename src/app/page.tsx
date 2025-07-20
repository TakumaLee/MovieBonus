'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, AlertCircle, RefreshCw, Film } from 'lucide-react';
import { useNowPlayingMovies, useComingSoonMovies } from '@/hooks';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import FeedbackForm from '@/components/FeedbackForm';
import { MovieImage } from '@/components/MovieImage';
import type { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  isClickable: boolean;
}

const MovieCard = ({ movie, isClickable }: MovieCardProps) => {
  // Use has_bonuses directly from movie data instead of separate API call
  const hasBonuses = movie.has_bonuses || false;

  const cardContent = (
    <Card className="overflow-hidden group border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
      <CardContent className="p-0 relative aspect-[2/3]">
        <MovieImage
          src={movie.poster_url || ''}
          alt={`Poster for ${movie.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="movie poster"
        />
        {hasBonuses && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-lg backdrop-blur-sm" variant="default">
            <Award className="w-3 h-3 mr-1" />
            特典
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
          <h3 className="font-headline text-base sm:text-lg text-white font-semibold drop-shadow-md line-clamp-2">{movie.title}</h3>
          {movie.english_title && (
            <p className="text-xs sm:text-sm text-white/80 font-medium line-clamp-1 mt-1">{movie.english_title}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {movie.status === 'showing' ? '上映中' : 
               movie.status === 'coming_soon' ? '即將上映' : '已下檔'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isClickable) {
    return (
      <Link href={`/movie/${encodeURIComponent(movie.id)}`} className="block focus:outline-none focus:ring-4 focus:ring-ring rounded-lg">
        {cardContent}
      </Link>
    );
  }

  return <div>{cardContent}</div>;
};

// Loading skeleton for movie grid
const MovieGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-8">
    {Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="space-y-3">
        <Skeleton className="w-full aspect-[2/3] rounded-lg" />
        <div className="space-y-2 px-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// Error state component
const ErrorStateComponent = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <EmptyState
    icon={<AlertCircle className="h-12 w-12" />}
    title="載入失敗"
    description={message}
    action={{ label: "重試", onClick: onRetry }}
  />
);

// Empty state component  
const EmptyStateComponent = ({ message }: { message: string }) => (
  <EmptyState
    icon={<Film className="h-12 w-12" />}
    title="暫無電影資料"
    description={message}
  />
);

// Movie grid with loading and error states
const MovieGrid = ({ 
  movies, 
  isLoading, 
  error, 
  onRetry, 
  isClickable = true,
  emptyMessage = "目前沒有電影資料"
}: { 
  movies: Movie[]; 
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
  isClickable?: boolean;
  emptyMessage?: string;
}) => {
  if (isLoading) {
    return <MovieGridSkeleton />;
  }

  if (error) {
    return <ErrorStateComponent message={error} onRetry={onRetry} />;
  }

  if (movies.length === 0) {
    return <EmptyStateComponent message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-8 animate-in fade-in duration-500">
      {movies.map((movie, index) => (
        <MovieCard key={movie.movie_id || movie.id || `movie-${index}`} movie={movie} isClickable={isClickable} />
      ))}
    </div>
  );
};

export default function Home() {
  const nowPlayingHook = useNowPlayingMovies();
  const comingSoonHook = useComingSoonMovies();

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-background">
        <header className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-card to-card/50 border-b">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary mb-4">
              特典速報
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed">
              台灣電影院特典與限定禮品的完整追蹤平台，不錯過任何精彩好康！
            </p>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <SearchBar className="w-full max-w-2xl" placeholder="搜尋電影、演員、導演..." />
            </div>
          </div>
        </header>
        
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Tabs defaultValue="now-playing" className="w-full max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12 mb-8">
              <TabsTrigger value="now-playing" className="text-sm sm:text-base">正在上映</TabsTrigger>
              <TabsTrigger value="coming-soon" className="text-sm sm:text-base">即將上映</TabsTrigger>
            </TabsList>
          
          <TabsContent value="now-playing">
            {/* System status alert */}
            {nowPlayingHook.error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  無法連接到後端服務。請確認後端服務正在運行 (localhost:8080)，或使用模擬資料。
                </AlertDescription>
              </Alert>
            )}
            
            <MovieGrid 
              movies={nowPlayingHook.movies}
              isLoading={nowPlayingHook.isLoading}
              error={nowPlayingHook.error}
              onRetry={nowPlayingHook.refresh}
              isClickable={true}
              emptyMessage="目前沒有正在上映的電影資料"
            />
          </TabsContent>
          
          <TabsContent value="coming-soon">
            {/* System status alert */}
            {comingSoonHook.error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  無法連接到後端服務。請確認後端服務正在運行 (localhost:8080)，或使用模擬資料。
                </AlertDescription>
              </Alert>
            )}
            
            <MovieGrid 
              movies={comingSoonHook.movies}
              isLoading={comingSoonHook.isLoading}
              error={comingSoonHook.error}
              onRetry={comingSoonHook.refresh}
              isClickable={false}
              emptyMessage="目前沒有即將上映的電影資料"
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-headline text-primary mb-2">特典速報</h3>
            <p className="text-sm text-muted-foreground mb-4">
              台灣電影特典資訊的最佳選擇
            </p>
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <span>資料來源：威秀影城、各大電影院</span>
              <span>即時更新</span>
              <span>© {new Date().getFullYear()} 特典速報</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Feedback Form */}
      <FeedbackForm />
    </div>
    </ErrorBoundary>
  );
}
