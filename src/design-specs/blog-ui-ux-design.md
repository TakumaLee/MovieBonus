# MovieBonus Blog UI/UX Design Specification

## Design System Overview

The blog feature integrates seamlessly with MovieBonus's existing design language, utilizing the established color palette, typography, and component library while introducing blog-specific patterns optimized for content consumption and SEO.

### Core Design Principles
1. **Content-First Approach**: Clean, distraction-free reading experience
2. **Taiwan User Preferences**: LINE sharing prominence, Traditional Chinese typography optimization
3. **SEO Optimization**: Semantic HTML structure, clear content hierarchy
4. **Mobile-First Design**: Touch-friendly interactions, responsive layouts
5. **Brand Consistency**: Maintains MovieBonus visual identity

## 1. Blog Homepage Design

### Hero Section
```
Layout Structure:
┌─────────────────────────────────────────────────────────────┐
│  Featured Post Carousel (16:9 aspect ratio)                 │
│  - Large cover image with gradient overlay                   │
│  - Category badge (top-left)                                 │
│  - Title, excerpt, author, date (bottom-left overlay)       │
│  - Reading time indicator                                    │
│  - Carousel dots/arrows for multiple features               │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**
- Height: 450px desktop, 300px mobile
- Background: Gradient overlay from black/90 to transparent
- Typography: 
  - Title: font-headline, text-4xl desktop, text-2xl mobile
  - Excerpt: font-body, text-lg, max 2 lines
- Interaction: Auto-rotate every 6 seconds, pause on hover

### Category Navigation Cards
```
Grid Layout (5 columns desktop, 2.5 columns mobile scroll):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  新片速報  │ │  特典情報  │ │  影城導覽  │ │  觀影推薦  │ │  票房快訊  │
│   Icon    │ │   Icon    │ │   Icon    │ │   Icon    │ │   Icon    │
│  (Count)  │ │  (Count)  │ │  (Count)  │ │  (Count)  │ │  (Count)  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Component Details:**
- Card size: 200px × 120px
- Background: bg-card with hover:border-primary transition
- Icons: Lucide React icons, 32px size
- Count: Badge component with muted variant
- Mobile: Horizontal scroll with snap-scroll

### Latest Posts Grid
```
Desktop Layout (3 columns + sidebar):
┌─────────────────────────────────────────────┬──────────────┐
│  Article Card 1                             │              │
│  ┌─────────┐                                │   Popular    │
│  │  Image  │  Title (2 lines max)           │   Posts      │
│  │ 16:9    │  Excerpt (3 lines max)         │              │
│  └─────────┘  Category | Date | Read Time   │   Trending   │
├─────────────────────────────────────────────┤   Tags       │
│  Article Card 2                             │              │
│  Similar layout...                          │   Newsletter │
├─────────────────────────────────────────────┤   Signup     │
│  Article Card 3                             │              │
└─────────────────────────────────────────────┴──────────────┘
```

**Article Card Component:**
- Uses existing Card component structure
- Image: 350px × 197px (16:9), lazy-loaded
- Title: font-headline, text-xl, hover:text-primary
- Excerpt: font-body, text-muted-foreground, line-clamp-3
- Meta: flex layout with Separator components
- Hover: transform scale(1.02), shadow-lg

### Sidebar Widgets

**Popular Posts Widget:**
```
┌─────────────────────────────┐
│  熱門文章                    │
├─────────────────────────────┤
│ 1. Post Title (views count) │
│ 2. Post Title (views count) │
│ 3. Post Title (views count) │
│ 4. Post Title (views count) │
│ 5. Post Title (views count) │
└─────────────────────────────┘
```

**Trending Tags Cloud:**
```
┌─────────────────────────────┐
│  熱門標籤                    │
├─────────────────────────────┤
│ #Marvel #皮克斯 #特典      │
│ #威秀 #IMAX #預售票         │
│ #首映會 #限量商品           │
└─────────────────────────────┘
```

## 2. Individual Post Page Design

### Reading Layout Structure
```
Desktop Layout:
┌────────────────────────────────────────────────────────────┐
│  Progress Bar (3px, primary color, sticky top)             │
├──────────────┬──────────────────────────┬─────────────────┤
│              │                          │                 │
│   TOC        │    Article Content       │   Related       │
│  (Sticky)    │                          │   Content       │
│              │    Hero Image            │                 │
│  - Intro     │    Title                 │   Movie Card    │
│  - Section 1 │    Meta Info             │                 │
│  - Section 2 │    Social Share          │   Promotion     │
│  - Section 3 │    Article Body          │   Cards         │
│  - Conclusion│    Author Box            │                 │
│              │    Related Posts         │   Social        │
│              │                          │   Share         │
└──────────────┴──────────────────────────┴─────────────────┘
```

### Typography System
```css
/* Optimized for Traditional Chinese reading */
.article-body {
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 18px;
  line-height: 1.8;
  letter-spacing: 0.05em;
}

.article-body h2 {
  font-family: 'Noto Serif TC', serif;
  font-size: 28px;
  margin-top: 48px;
  margin-bottom: 24px;
  font-weight: 600;
}

.article-body p {
  margin-bottom: 24px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .article-body {
    font-size: 16px;
    line-height: 1.75;
  }
}
```

### Social Sharing Component
```
Position: Floating left sidebar (desktop), Bottom sticky bar (mobile)

Desktop:
┌───┐
│LINE│ -> Primary share button (larger)
├───┤
│ FB │
├───┤
│ X  │
├───┤
│Copy│
└───┘

Mobile (bottom bar):
┌─────────────────────────────────────┐
│ LINE | Facebook | Twitter | Copy    │
└─────────────────────────────────────┘
```

**Implementation Details:**
- LINE button: 1.5x size, bg-success color
- Share count display (optional)
- Copy link with toast notification
- Native share API on mobile

### Table of Contents (TOC)
```
Desktop (Sticky Sidebar):
┌─────────────────────────┐
│ 本文目錄                │
├─────────────────────────┤
│ • 簡介                  │ <- Active section highlighted
│ • 電影資訊              │
│   ◦ 劇情簡介           │
│   ◦ 演員陣容           │
│ • 特典詳情              │
│ • 購票方式              │
│ • 結語                  │
└─────────────────────────┘
```

**Features:**
- Smooth scroll to section
- Active section highlighting
- Progress indicator per section
- Collapsible on mobile

### Author Info Box
```
┌──────────────────────────────────────────────────┐
│ 👤 MovieBonus 編輯部                             │
│ 專注於台灣電影特典資訊，為影迷提供最即時完整的   │
│ 電影優惠與限定商品情報。                         │
│ [關注更多] [查看所有文章]                        │
└──────────────────────────────────────────────────┘
```

## 3. Archive/Category Pages

### Category Header
```
┌─────────────────────────────────────────────────┐
│  Category Icon                                  │
│  新片速報                                       │
│  最新上映電影的第一手消息與特典情報              │
│  共 156 篇文章                                  │
└─────────────────────────────────────────────────┘
```

### Filter and Search Bar
```
┌─────────────────────────────────────────────────┐
│ 🔍 搜尋文章...                   [篩選▼] [排序▼] │
└─────────────────────────────────────────────────┘

Filters:
- 時間範圍 (本週/本月/今年/全部)
- 標籤 (多選)
- 作者

Sort:
- 最新發布
- 最多瀏覽
- 最多分享
```

### Post Grid Layout
```
Responsive Grid (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col):
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Post 1   │ │  Post 2   │ │  Post 3   │
└───────────┘ └───────────┘ └───────────┘
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Post 4   │ │  Post 5   │ │  Post 6   │
└───────────┘ └───────────┘ └───────────┘

[載入更多文章] <- Infinite scroll or pagination
```

## 4. Mobile Responsive Design

### Mobile Navigation Pattern
```
Bottom Navigation Bar (Fixed):
┌─────────────────────────────────────────────┐
│  首頁  │  分類  │  搜尋  │  收藏  │  更多  │
│   🏠   │   📑   │   🔍   │   ⭐   │   ⋯    │
└─────────────────────────────────────────────┘
```

### Touch Interactions
- Swipe gestures for carousel navigation
- Pull-to-refresh on archive pages
- Long-press for quick share menu
- Haptic feedback on interactions (iOS)

### Mobile-Specific Features
1. **Collapsed TOC**: Expandable bottom sheet
2. **Reading Mode**: Simplified layout, adjustable font size
3. **Offline Reading**: Cache recent articles
4. **Quick Actions**: Floating action button for share/save

## 5. Component Specifications

### BlogPostCard Component
```tsx
interface BlogPostCardProps {
  title: string;
  excerpt: string;
  coverImage: string;
  category: Category;
  author: Author;
  publishedAt: Date;
  readingTime: number;
  slug: string;
  featured?: boolean;
  tags?: string[];
}

// Visual states
- Default: border-transparent
- Hover: border-primary, scale(1.02)
- Active: scale(0.98)
- Loading: Skeleton animation
```

### CategoryBadge Component
```tsx
interface CategoryBadgeProps {
  category: 'news' | 'bonus' | 'theater' | 'review' | 'boxoffice';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

// Color mapping
const categoryColors = {
  news: 'bg-info',
  bonus: 'bg-warning',
  theater: 'bg-secondary',
  review: 'bg-success',
  boxoffice: 'bg-primary'
};
```

### ReadingProgress Component
```tsx
interface ReadingProgressProps {
  articleRef: RefObject<HTMLElement>;
  showPercentage?: boolean;
  position?: 'top' | 'bottom';
}

// Features
- Smooth animation
- Hide on scroll up (mobile)
- Click to jump to position
```

## 6. Micro-interactions & Animations

### Hover States
- **Cards**: Scale transform with shadow elevation
- **Links**: Color transition with underline animation
- **Buttons**: Background color shift with ripple effect
- **Images**: Zoom effect with overlay fade

### Loading States
- **Skeleton screens** for content placeholders
- **Progressive image loading** with blur-up effect
- **Infinite scroll spinner** with brand animation

### Feedback Animations
- **Like button**: Heart burst animation
- **Share success**: Toast with slide-in animation
- **Save article**: Bookmark fill animation
- **Copy link**: Ripple effect with success checkmark

## 7. Accessibility Standards

### WCAG 2.1 Compliance
- **Color Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Reader**: Semantic HTML with ARIA labels

### Semantic Structure
```html
<article role="article" aria-labelledby="post-title">
  <header>
    <h1 id="post-title">Article Title</h1>
    <nav aria-label="Article metadata">...</nav>
  </header>
  <nav aria-label="Table of contents">...</nav>
  <main>
    <section aria-labelledby="section-heading">...</section>
  </main>
  <footer>
    <nav aria-label="Social sharing">...</nav>
  </footer>
</article>
```

## 8. Performance Optimizations

### Image Optimization
- WebP format with JPEG fallback
- Responsive images with srcset
- Lazy loading with intersection observer
- Blur-up placeholders (LQIP)

### Code Splitting
- Route-based splitting for blog pages
- Component lazy loading for heavy widgets
- Dynamic imports for share functionality

### Caching Strategy
- Static assets: 1 year cache
- API responses: 5 minutes cache
- HTML pages: No-cache with ETag
- Service worker for offline support

## 9. Integration with Existing Components

### Reusable Components
- `Card`, `CardHeader`, `CardContent` - Post cards
- `Badge` - Category and tag labels
- `Button` - CTAs and actions
- `Skeleton` - Loading states
- `ScrollArea` - TOC and sidebars
- `Tabs` - Category filters
- `Dialog` - Share modals
- `Toast` - Notifications

### New Components Needed
- `BlogPostCard` - Specialized post preview
- `ReadingProgress` - Article progress bar
- `TableOfContents` - Dynamic TOC
- `ShareButtons` - Social sharing
- `AuthorBio` - Author information
- `RelatedPosts` - Recommendation grid
- `NewsletterSignup` - Email capture

## 10. Taiwan Market Considerations

### LINE Integration Priority
- Prominent LINE share button
- LINE notify for new posts
- LINE login for comments (future)

### Traditional Chinese Typography
- Optimized font sizes for Chinese characters
- Appropriate line-height for readability
- Careful spacing for mixed language content

### Local Social Platforms
- Facebook (still dominant in Taiwan)
- Instagram story sharing
- PTT sharing format support

### Cultural Design Elements
- Red accents for important CTAs (lucky color)
- Rounded corners (softer, friendlier aesthetic)
- Dense information layout (expected pattern)