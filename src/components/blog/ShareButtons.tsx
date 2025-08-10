/**
 * ShareButtons Component
 * 
 * Social sharing buttons optimized for Taiwan market
 * with LINE prominence, Facebook, Twitter, and copy functionality
 */

'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle,
  Facebook,
  Twitter,
  Link2,
  Mail,
  CheckCircle,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { ShareData } from '@/lib/types';
import { generateSocialShareUrls } from '@/lib/blog-seo-utils';
import { trackEngagement } from '@/lib/blog-api-client';

interface ShareButtonsProps {
  data: ShareData;
  postId?: string;
  variant?: 'default' | 'compact' | 'floating' | 'minimal';
  orientation?: 'horizontal' | 'vertical';
  showCounts?: boolean;
  showLabels?: boolean;
  className?: string;
}

interface ShareCount {
  platform: string;
  count: number;
}

export default function ShareButtons({
  data,
  postId,
  variant = 'default',
  orientation = 'horizontal',
  showCounts = false,
  showLabels = true,
  className = ''
}: ShareButtonsProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [sharing, setSharing] = useState<string | null>(null);
  const [shareCounts, setShareCounts] = useState<ShareCount[]>([]);

  // Generate share URLs
  const shareUrls = generateSocialShareUrls({
    url: data.url,
    title: data.title,
    description: data.description,
    hashtags: data.hashtags
  });

  // Handle share action
  const handleShare = async (platform: string, url: string) => {
    setSharing(platform);

    try {
      // Track engagement
      if (postId) {
        await trackEngagement(postId, {
          scroll_depth: 0,
          time_on_page: 0,
          interactions: 1
        });
      }

      // Use Web Share API if available and supported
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url
        });
        toast({
          title: "分享成功",
          description: "已成功分享文章",
        });
        return;
      }

      // Open share window
      if (platform !== 'copy' && platform !== 'email') {
        const width = 600;
        const height = 400;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2.5;
        
        window.open(
          url,
          'share',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
      } else if (platform === 'email') {
        window.location.href = url;
      } else if (platform === 'copy') {
        await handleCopyUrl();
      }

      // Show success message
      const platformNames = {
        line: 'LINE',
        facebook: 'Facebook',
        twitter: 'Twitter',
        whatsapp: 'WhatsApp',
        email: '電子郵件'
      };

      if (platform !== 'copy') {
        toast({
          title: "正在分享",
          description: `正在透過 ${platformNames[platform as keyof typeof platformNames]} 分享`,
        });
      }

    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "分享失敗",
        description: "無法完成分享，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setSharing(null);
    }
  };

  // Handle copy URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      setCopiedUrl(true);
      
      toast({
        title: "連結已複製",
        description: "文章連結已複製到剪貼簿",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "複製失敗",
        description: "無法複製連結，請手動複製",
        variant: "destructive"
      });
    }
  };

  const shareButtons = [
    {
      platform: 'line',
      icon: MessageCircle,
      label: 'LINE',
      url: shareUrls.line,
      color: 'bg-green-500 hover:bg-green-600',
      primary: true // LINE is primary in Taiwan
    },
    {
      platform: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      url: shareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      platform: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      url: shareUrls.twitter,
      color: 'bg-black hover:bg-gray-800'
    },
    {
      platform: 'copy',
      icon: copiedUrl ? CheckCircle : Link2,
      label: copiedUrl ? '已複製' : '複製連結',
      url: '',
      color: copiedUrl ? 'bg-green-500' : 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  const containerClass = {
    default: orientation === 'horizontal' ? 'flex flex-wrap gap-3' : 'flex flex-col gap-3',
    compact: orientation === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-2',
    floating: 'flex flex-col gap-2',
    minimal: 'flex gap-1'
  }[variant];

  const buttonSize = {
    default: 'h-10',
    compact: 'h-8',
    floating: 'h-12 w-12',
    minimal: 'h-8 w-8'
  }[variant];

  return (
    <TooltipProvider>
      <div className={`${containerClass} ${className}`}>
        {/* Native Share Button (mobile) */}
        {typeof window !== 'undefined' && navigator.share && (
          <ShareButton
            platform="native"
            icon={Share2}
            label="分享"
            onClick={() => handleShare('native', '')}
            variant={variant}
            showLabel={showLabels}
            size={buttonSize}
            loading={sharing === 'native'}
          />
        )}

        {/* Platform Share Buttons */}
        {shareButtons.map(({ platform, icon: Icon, label, url, color, primary }) => (
          <ShareButton
            key={platform}
            platform={platform}
            icon={Icon}
            label={label}
            onClick={() => handleShare(platform, url)}
            color={color}
            variant={variant}
            showLabel={showLabels && variant !== 'floating'}
            size={buttonSize}
            primary={primary}
            loading={sharing === platform}
            disabled={copiedUrl && platform === 'copy'}
          />
        ))}

        {/* Email Share */}
        {variant !== 'minimal' && (
          <ShareButton
            platform="email"
            icon={Mail}
            label="電子郵件"
            onClick={() => handleShare('email', shareUrls.email)}
            color="bg-gray-600 hover:bg-gray-700"
            variant={variant}
            showLabel={showLabels && variant !== 'floating'}
            size={buttonSize}
            loading={sharing === 'email'}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

// Individual Share Button Component
function ShareButton({
  platform,
  icon: Icon,
  label,
  onClick,
  color = 'bg-gray-500 hover:bg-gray-600',
  variant = 'default',
  showLabel = true,
  size = 'h-10',
  primary = false,
  loading = false,
  disabled = false
}: {
  platform: string;
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color?: string;
  variant?: string;
  showLabel?: boolean;
  size?: string;
  primary?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  const button = (
    <Button
      onClick={onClick}
      variant={variant === 'minimal' ? 'ghost' : 'default'}
      size="sm"
      className={`${size} ${
        variant === 'floating' ? 'rounded-full p-0' : ''
      } ${
        variant === 'minimal' 
          ? 'text-muted-foreground hover:text-foreground' 
          : `${color} text-white border-none ${
              primary ? 'ring-2 ring-primary/50' : ''
            }`
      } transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
      }`}
      disabled={loading || disabled}
    >
      <Icon className={`${
        variant === 'floating' ? 'w-6 h-6' : 
        variant === 'compact' || variant === 'minimal' ? 'w-4 h-4' : 'w-5 h-5'
      } ${loading ? 'animate-pulse' : ''}`} />
      
      {showLabel && (
        <span className={`${
          variant === 'compact' ? 'text-xs' : 'text-sm'
        } font-medium ml-2`}>
          {label}
        </span>
      )}
      
      {primary && variant !== 'minimal' && (
        <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
          推薦
        </Badge>
      )}
    </Button>
  );

  // Wrap floating buttons with tooltip
  if (variant === 'floating') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

// Floating Share Buttons (for post pages)
export function FloatingShareButtons({
  data,
  postId,
  className = ''
}: {
  data: ShareData;
  postId?: string;
  className?: string;
}) {
  return (
    <Card className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 shadow-lg ${className} hidden lg:block`}>
      <CardContent className="p-3">
        <ShareButtons
          data={data}
          postId={postId}
          variant="floating"
          orientation="vertical"
          showLabels={false}
        />
      </CardContent>
    </Card>
  );
}

// Mobile Share Bar (bottom sticky)
export function MobileShareBar({
  data,
  postId,
  className = ''
}: {
  data: ShareData;
  postId?: string;
  className?: string;
}) {
  return (
    <Card className={`fixed bottom-0 left-0 right-0 z-40 rounded-none border-x-0 border-b-0 lg:hidden ${className}`}>
      <CardContent className="p-4">
        <ShareButtons
          data={data}
          postId={postId}
          variant="compact"
          orientation="horizontal"
          showLabels={false}
          className="justify-center"
        />
      </CardContent>
    </Card>
  );
}

// Compact inline share buttons
export function InlineShareButtons({
  data,
  postId,
  className = ''
}: {
  data: ShareData;
  postId?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">分享：</span>
      <ShareButtons
        data={data}
        postId={postId}
        variant="minimal"
        orientation="horizontal"
        showLabels={false}
      />
    </div>
  );
}