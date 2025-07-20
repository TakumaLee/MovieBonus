'use client';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  logo?: string;
  sameAs?: string[];
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': string;
    name: string;
  };
  potentialAction: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface MovieSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  image?: string;
  genre?: string[];
  datePublished?: string;
  url: string;
  publisher: {
    '@type': string;
    name: string;
  };
  offers?: {
    '@type': string;
    availability: string;
    price?: string;
    priceCurrency?: string;
  };
}

interface StructuredDataProps {
  type: 'website' | 'movie' | 'organization';
  data?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    genre?: string[];
    datePublished?: string;
    price?: string;
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = 'https://paruparu.vercel.app';
  
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        const organizationSchema: OrganizationSchema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '特典速報',
          url: baseUrl,
          description: '台灣最完整的電影特典與限定禮品追蹤平台',
          logo: `${baseUrl}/logo.png`,
          sameAs: [
            // 可以添加社交媒體連結
          ],
        };
        return organizationSchema;

      case 'website':
        const websiteSchema: WebsiteSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '特典速報',
          url: baseUrl,
          description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊，不錯過任何精彩好康！',
          publisher: {
            '@type': 'Organization',
            name: '特典速報',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };
        return websiteSchema;

      case 'movie':
        const movieSchema: MovieSchema = {
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: data?.title || '電影',
          description: data?.description,
          image: data?.image,
          genre: data?.genre,
          datePublished: data?.datePublished,
          url: data?.url || baseUrl,
          publisher: {
            '@type': 'Organization',
            name: '特典速報',
          },
        };

        if (data?.price) {
          movieSchema.offers = {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            price: data.price,
            priceCurrency: 'TWD',
          };
        }

        return movieSchema;

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}