import { curateMovieBonuses, type CurateMovieBonusesOutput } from '@/ai/flows/curate-movie-bonuses';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, ChevronLeft, Film, Gift, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MovieDetailsPageProps {
  params: {
    title: string;
  };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movieTitle = decodeURIComponent(params.title);
  let bonusData: CurateMovieBonusesOutput | null = null;
  let error: string | null = null;

  // try {
  //   bonusData = await curateMovieBonuses({ movieTitle });
  // } catch (e) {
  //   console.error(`Failed to curate bonuses for ${movieTitle}:`, e);
  //   error = "An error occurred while fetching bonus information. The AI service may be temporarily unavailable. Please try again later.";
  // }

  bonusData = {
    bonuses: [
      {
        bonusName: "第1弾「スペシャル描き下ろしA5カード」",
        description: "第1弾の来場者特典は、キャラクターデザイン担当者によるスペシャル描き下ろしA5カードです。数量限定のため、なくなり次第終了となります。",
        imageUrl: 'https://placehold.co/300x300.png',
        distributionPeriod: "公開第1週目",
        rules: "ご鑑賞者1名様につき1点プレゼント",
      },
      {
        bonusName: "第2弾「キャラクターデザインステッカーセット」",
        description: "映画の主要キャラクターたちの特製ビニールステッカーセットです。",
        imageUrl: 'https://placehold.co/300x300.png',
        distributionPeriod: "公開第2週目",
        rules: "ご鑑賞者1名様につき1セットプレゼント",
      },
      {
        bonusName: "第3弾「オリジナル・サウンドトラック・サンプラー」",
        description: "映画のオリジナル・サウンドトラックのサンプラー版がダウンロードできるコードです。",
        imageUrl: 'https://placehold.co/300x300.png',
        distributionPeriod: "公開第3週目",
        rules: "チケット1枚ご購入につき1つのダウンロードコード",
      },
    ],
  };

  const moviePoster = `https://placehold.co/400x600.png`;

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto py-8 sm:py-12 px-4">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Movies
            </Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <Card className="overflow-hidden sticky top-8">
              <Image
                src={moviePoster}
                alt={`Poster for ${movieTitle}`}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint="movie poster"
              />
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">{movieTitle}</CardTitle>
              </CardHeader>
            </Card>
          </aside>

          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="flex items-center gap-4 mb-6">
               <Gift className="w-8 h-8 text-accent"/>
              <h2 className="text-3xl md:text-4xl font-headline text-primary">Available Bonuses</h2>
            </div>
            
            <Separator className="mb-8" />

            {error && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!error && (!bonusData || bonusData.bonuses.length === 0) && (
              <Card className="bg-card/80">
                <CardContent className="p-6 flex items-center gap-4">
                  <Film className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-bold text-lg">No Bonuses Found</h3>
                    <p className="text-muted-foreground">
                      No special bonuses have been announced for this movie yet. Please check back later!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!error && bonusData && bonusData.bonuses.length > 0 && (
              <div className="space-y-6">
                {bonusData.bonuses.map((bonus, index) => (
                  <Card key={index} className="overflow-hidden shadow-md transition-shadow hover:shadow-xl">
                    <div className="grid md:grid-cols-3">
                      <div className="md:col-span-1">
                        <Image
                          src={bonus.imageUrl || 'https://placehold.co/300x300.png'}
                          alt={`Image for ${bonus.bonusName}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                           data-ai-hint="promotional item"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-2xl font-headline text-accent">{bonus.bonusName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-bold flex items-center gap-2 mb-1"><Info className="w-4 h-4"/>Description</h4>
                            <p className="text-muted-foreground">{bonus.description}</p>
                          </div>
                          <Separator/>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-bold flex items-center gap-2 mb-1"><Calendar className="w-4 h-4"/>Distribution Period</h4>
                              <p className="text-muted-foreground">{bonus.distributionPeriod}</p>
                            </div>
                            <div>
                               <h4 className="font-bold flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4"/>Acquisition Rules</h4>
                               <p className="text-muted-foreground">{bonus.rules}</p>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
