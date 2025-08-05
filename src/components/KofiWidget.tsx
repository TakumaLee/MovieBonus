'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Helper function to get CSS variable value
function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') return '#FF5E5B'; // fallback for SSR
  
  const hslValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  
  if (!hslValue) return '#FF5E5B'; // fallback
  
  // Convert HSL to HEX for Ko-fi compatibility
  const [h, s, l] = hslValue.split(' ').map(v => parseFloat(v.replace('%', '')));
  return hslToHex(h, s / 100, l / 100);
}

// Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface KofiWidgetProps {
  color?: string;
  id: string;
  label?: string;
}

// Ko-fi 嵌入式按鈕元件
export function KofiButton({ 
  color, 
  id = 'nebulab', 
  label = '請我喝咖啡' 
}: KofiWidgetProps) {
  useEffect(() => {
    const kofiColor = color || getCSSVariable('--kofi-primary');
    // 確保 Ko-fi script 載入後再初始化
    if (typeof window !== 'undefined' && (window as any).kofiwidget2) {
      (window as any).kofiwidget2.init(label, kofiColor, id);
      (window as any).kofiwidget2.draw('supportByBuyingCoffee', {
        type: 'floating',
        'floating-chat.enabled': true,
        'floating-chat.donateButton.text': '贊助',
        'floating-chat.donateButton.background-color': kofiColor,
        'floating-chat.donateButton.text-color': '#fff'
      });
    }
  }, [color, id, label]);

  return (
    <>
      <Script
        src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          const kofiColor = color || getCSSVariable('--kofi-primary');
          if (typeof window !== 'undefined' && (window as any).kofiwidget2) {
            (window as any).kofiwidget2.init(label, kofiColor, id);
            (window as any).kofiwidget2.draw('supportByBuyingCoffee', {
              type: 'floating',
              'floating-chat.enabled': true,
              'floating-chat.donateButton.text': '贊助',
              'floating-chat.donateButton.background-color': kofiColor,
              'floating-chat.donateButton.text-color': '#fff'
            });
          }
        }}
      />
      <div id="supportByBuyingCoffee"></div>
    </>
  );
}

// Ko-fi 內嵌式捐贈面板
export function KofiPanel({ color, id = 'nebulab' }: Omit<KofiWidgetProps, 'label'>) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
    script.async = true;
    
    script.onload = () => {
      const kofiColor = color || getCSSVariable('--kofi-primary');
      if (typeof window !== 'undefined' && (window as any).kofiWidgetOverlay) {
        (window as any).kofiWidgetOverlay.draw(id, {
          'type': 'floating',
          'floating-chat.enabled': true,
          'floating-chat.donateButton.text': '支持我們',
          'floating-chat.donateButton.background-color': kofiColor,
          'floating-chat.donateButton.text-color': '#fff',
          'floating-chat.supportedText': '感謝您的支持！',
          'floating-chat.widgetTitle': '支持特典速報'
        });
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      // 清理 script
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [color, id]);

  return null;
}

// Ko-fi 簡單按鈕（使用 iframe）
export function KofiSimpleButton({ id = 'nebulab' }: { id?: string }) {
  return (
    <iframe 
      id='kofiframe' 
      src={`https://ko-fi.com/${id}/?hidefeed=true&widget=true&embed=true&preview=true`}
      style={{
        border: 'none',
        width: '100%',
        padding: '4px',
        background: '#f9f9f9',
        borderRadius: '8px'
      }}
      height='712' 
      title='nebulab'
    />
  );
}