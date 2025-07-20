import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Film, Gift, Info, ShieldCheck, TriangleAlert, RefreshCw, AlertCircle, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MovieDetailClient } from './MovieDetailClient';

interface MovieDetailsPageProps {
  params: Promise<{
    movieId: string;
  }>;
}

// 為靜態匯出提供預設的電影 ID
export async function generateStaticParams() {
  // 返回空陣列，讓所有路由都動態生成
  return [];
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  return <MovieDetailClient params={params} />;
}