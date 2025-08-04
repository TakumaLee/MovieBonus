'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface KofiWidgetProps {
  color?: string;
  id: string;
  label?: string;
}

// Ko-fi 嵌入式按鈕元件
export function KofiButton({ 
  color = '#FF5E5B', 
  id = 'nebulab', 
  label = '請我喝咖啡' 
}: KofiWidgetProps) {
  useEffect(() => {
    // 確保 Ko-fi script 載入後再初始化
    if (typeof window !== 'undefined' && (window as any).kofiwidget2) {
      (window as any).kofiwidget2.init(label, color, id);
      (window as any).kofiwidget2.draw('supportByBuyingCoffee', {
        type: 'floating',
        'floating-chat.enabled': true,
        'floating-chat.donateButton.text': '贊助',
        'floating-chat.donateButton.background-color': color,
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
          if (typeof window !== 'undefined' && (window as any).kofiwidget2) {
            (window as any).kofiwidget2.init(label, color, id);
            (window as any).kofiwidget2.draw('supportByBuyingCoffee', {
              type: 'floating',
              'floating-chat.enabled': true,
              'floating-chat.donateButton.text': '贊助',
              'floating-chat.donateButton.background-color': color,
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
export function KofiPanel({ color = '#FF5E5B', id = 'nebulab' }: Omit<KofiWidgetProps, 'label'>) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
    script.async = true;
    
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).kofiWidgetOverlay) {
        (window as any).kofiWidgetOverlay.draw(id, {
          'type': 'floating',
          'floating-chat.enabled': true,
          'floating-chat.donateButton.text': '支持我們',
          'floating-chat.donateButton.background-color': color,
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