import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

const nowPlayingMovies = [
  { title: 'Kingdom of the Planet of the Apes', posterHint: 'simian leader', hasBonus: true },
  { title: 'The Fall Guy', posterHint: 'action stuntman', hasBonus: true },
  { title: 'Challengers', posterHint: 'tennis players', hasBonus: false },
  { title: 'IF', posterHint: 'imaginary friends', hasBonus: true },
  { title: 'The Garfield Movie', posterHint: 'orange cat', hasBonus: false },
];

const comingSoonMovies = [
  { title: 'Furiosa: A Mad Max Saga', posterHint: 'desert warrior' },
  { title: 'Inside Out 2', posterHint: 'emotional characters' },
  { title: 'A Quiet Place: Day One', posterHint: 'alien monster' },
  { title: 'Despicable Me 4', posterHint: 'yellow minions' },
  { title: 'Deadpool & Wolverine', posterHint: 'superhero duo' },
];

interface Movie {
  title: string;
  posterHint: string;
  hasBonus?: boolean;
}

const MovieCard = ({ movie, isClickable }: { movie: Movie; isClickable: boolean; }) => {
  const cardContent = (
    <Card className="overflow-hidden group border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-0 relative">
        <Image
          src={`https://placehold.co/400x600.png`}
          alt={`Poster for ${movie.title}`}
          width={400}
          height={600}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={movie.posterHint}
        />
        {movie.hasBonus && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground shadow-lg" variant="default">
            <Award className="w-3 h-3 mr-1" />
            Bonus
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-headline text-lg text-white font-semibold drop-shadow-md">{movie.title}</h3>
        </div>
      </CardContent>
    </Card>
  );

  if (isClickable) {
    return (
      <Link href={`/movie/${encodeURIComponent(movie.title)}`} className="block focus:outline-none focus:ring-4 focus:ring-ring rounded-lg">
        {cardContent}
      </Link>
    );
  }

  return <div>{cardContent}</div>;
};

const MovieGrid = ({ movies, isClickable = true }: { movies: Movie[]; isClickable?: boolean }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 animate-in fade-in duration-500">
    {movies.map((movie) => (
      <MovieCard key={movie.title} movie={movie} isClickable={isClickable} />
    ))}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-b">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-headline text-primary">特典速報</h1>
          <p className="text-lg text-muted-foreground mt-4 font-body max-w-2xl mx-auto">
            Your ultimate guide to exclusive movie release bonuses and special gifts in Japan.
          </p>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="now-playing" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
            <TabsTrigger value="now-playing" className="text-base">Now Playing</TabsTrigger>
            <TabsTrigger value="coming-soon" className="text-base">Coming Soon</TabsTrigger>
          </TabsList>
          <TabsContent value="now-playing">
            <MovieGrid movies={nowPlayingMovies} />
          </TabsContent>
          <TabsContent value="coming-soon">
            <MovieGrid movies={comingSoonMovies} isClickable={false} />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center py-6 px-4 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 特典速報. All rights reserved.</p>
      </footer>
    </div>
  );
}
