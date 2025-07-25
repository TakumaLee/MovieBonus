// Google Analytics 配置
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 預設義一些常用的事件追蹤
export const trackEvent = {
  // 電影搜尋事件
  movieSearch: (query: string) => {
    event({
      action: 'search',
      category: 'Movie',
      label: query,
    });
  },
  
  // 電影詳情查看事件
  movieView: (movieTitle: string) => {
    event({
      action: 'view_movie',
      category: 'Movie',
      label: movieTitle,
    });
  },
  
  // 特典查看事件
  promotionView: (promotionTitle: string) => {
    event({
      action: 'view_promotion',
      category: 'Promotion',
      label: promotionTitle,
    });
  },
  
  // 外部連結點擊事件
  externalLink: (url: string) => {
    event({
      action: 'click',
      category: 'External Link',
      label: url,
    });
  },
  
  // 反饋提交事件
  feedbackSubmit: (type: string) => {
    event({
      action: 'submit',
      category: 'Feedback',
      label: type,
    });
  },
};