'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoviePromotion, GiftType } from '@/lib/types';
import { Calendar, Edit, Gift, MapPin, Power, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface BonusCardProps {
  promotion: MoviePromotion;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export default function BonusCard({ promotion, onEdit, onDelete, onToggleStatus }: BonusCardProps) {
  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy/MM/dd', { locale: zhTW });
    } catch {
      return dateString;
    }
  };
  
  // 取得特典類型標籤
  const getPromotionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'pre_order': '預購特典',
      'first_week': '首週特典',
      'theater_exclusive': '戲院限定',
      'collaboration': '合作特典',
      'limited_edition': '限量版',
      'special_screening': '特別場次',
      'other': '其他',
    };
    return typeMap[type] || type;
  };
  
  // 取得禮品類型標籤
  const getGiftTypeLabel = (type?: GiftType) => {
    if (!type) return '';
    const typeMap: Record<GiftType, string> = {
      'physical': '實體禮品',
      'digital': '數位內容',
      'experience': '體驗活動',
      'discount': '折扣優惠',
    };
    return typeMap[type];
  };
  
  // 取得禮品類型顏色
  const getGiftTypeVariant = (type?: GiftType): 'default' | 'secondary' | 'outline' | 'destructive' => {
    if (!type) return 'default';
    const variantMap: Record<GiftType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      'physical': 'default',
      'digital': 'secondary',
      'experience': 'outline',
      'discount': 'destructive',
    };
    return variantMap[type];
  };
  
  return (
    <Card className={!promotion.is_active ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{promotion.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getPromotionTypeLabel(promotion.promotion_type)}
              </Badge>
              <Badge variant={promotion.is_active ? 'default' : 'secondary'}>
                {promotion.is_active ? '啟用中' : '已停用'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleStatus}
              title={promotion.is_active ? '停用' : '啟用'}
            >
              <Power className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive/90"
              aria-label="刪除特典"
              title="刪除特典"
            >
              <span className="flex items-center gap-1">
                <Trash2 className="h-4 w-4 hidden md:inline" />
                <span>刪除</span>
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 特典說明 */}
        {promotion.description && (
          <p className="text-sm text-muted-foreground">{promotion.description}</p>
        )}
        
        {/* 日期資訊 */}
        {(promotion.release_date || promotion.end_date) && (
          <div className="flex items-center gap-4 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {promotion.release_date && formatDate(promotion.release_date)}
              {promotion.release_date && promotion.end_date && ' ~ '}
              {promotion.end_date && formatDate(promotion.end_date)}
            </span>
          </div>
        )}
        
        {/* 取得方式 */}
        {promotion.acquisition_method && (
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              取得方式
            </p>
            <p className="text-sm text-muted-foreground pl-6">
              {promotion.acquisition_method}
            </p>
          </div>
        )}
        
        {/* 禮品列表 */}
        {promotion.gifts && promotion.gifts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4" />
              禮品項目 ({promotion.gifts.length})
            </p>
            <div className="grid gap-2 pl-6">
              {promotion.gifts.map((gift, index) => (
                <div key={gift.id || index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  {gift.gift_image_url && (
                    <img
                      src={gift.gift_image_url}
                      alt={gift.gift_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{gift.gift_name}</p>
                      {gift.gift_type && (
                        <Badge variant={getGiftTypeVariant(gift.gift_type)} className="text-xs">
                          {getGiftTypeLabel(gift.gift_type)}
                        </Badge>
                      )}
                      {gift.is_exclusive && (
                        <Badge variant="destructive" className="text-xs">
                          獨家
                        </Badge>
                      )}
                    </div>
                    {gift.gift_description && (
                      <p className="text-xs text-muted-foreground">{gift.gift_description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {gift.quantity && (
                        <span>數量限制: {gift.quantity}</span>
                      )}
                      <span>每人限制: {gift.per_person_limit}</span>
                      {gift.estimated_value && (
                        <span>預估價值: NT${gift.estimated_value}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 注意事項 */}
        {promotion.terms_and_conditions && (
          <div className="space-y-1">
            <p className="text-sm font-medium">注意事項</p>
            <p className="text-sm text-muted-foreground">
              {promotion.terms_and_conditions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}