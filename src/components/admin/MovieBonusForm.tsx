'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MoviePromotion, PromotionGift } from '@/lib/types';
import { Calendar, Gift, Plus, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

// 表單驗證 schema
const promotionSchema = z.object({
  promotion_type: z.string().min(1, '請選擇特典類型'),
  title: z.string().min(1, '請輸入特典標題').max(200, '標題不能超過 200 字'),
  description: z.string().optional(),
  release_date: z.string().optional(),
  end_date: z.string().optional(),
  acquisition_method: z.string().optional(),
  terms_and_conditions: z.string().optional(),
  is_active: z.boolean().default(true),
  gifts: z.array(z.object({
    gift_name: z.string().min(1, '請輸入禮品名稱'),
    gift_type: z.enum(['physical', 'digital', 'experience', 'discount']).optional(),
    gift_description: z.string().optional(),
    gift_image_url: z.string().url().optional().or(z.literal('')),
    quantity: z.number().min(0).optional(),
    per_person_limit: z.number().min(1).default(1),
    estimated_value: z.number().min(0).optional(),
    is_exclusive: z.boolean().default(false),
  })).min(1, '至少需要新增一個禮品'),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface MovieBonusFormProps {
  movieId: string;
  promotion?: MoviePromotion;
  onSubmit: (data: PromotionFormData) => Promise<void>;
  onCancel: () => void;
}

const promotionTypes = [
  { value: 'pre_order', label: '預購特典' },
  { value: 'first_week', label: '首週特典' },
  { value: 'theater_exclusive', label: '戲院限定' },
  { value: 'collaboration', label: '合作特典' },
  { value: 'limited_edition', label: '限量版' },
  { value: 'special_screening', label: '特別場次' },
  { value: 'other', label: '其他' },
];

const giftTypes = [
  { value: 'physical', label: '實體禮品' },
  { value: 'digital', label: '數位內容' },
  { value: 'experience', label: '體驗活動' },
  { value: 'discount', label: '折扣優惠' },
];

export default function MovieBonusForm({ movieId, promotion, onSubmit, onCancel }: MovieBonusFormProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      promotion_type: promotion?.promotion_type || '',
      title: promotion?.title || '',
      description: promotion?.description || '',
      release_date: promotion?.release_date || '',
      end_date: promotion?.end_date || '',
      acquisition_method: promotion?.acquisition_method || '',
      terms_and_conditions: promotion?.terms_and_conditions || '',
      is_active: promotion?.is_active ?? true,
      gifts: promotion?.gifts || [{
        gift_name: '',
        gift_type: undefined,
        gift_description: '',
        gift_image_url: '',
        quantity: undefined,
        per_person_limit: 1,
        estimated_value: undefined,
        is_exclusive: false,
      }],
    },
  });
  
  const handleFormSubmit = async (data: PromotionFormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };
  
  // 新增禮品項目
  const addGift = () => {
    const currentGifts = form.getValues('gifts');
    form.setValue('gifts', [...currentGifts, {
      gift_name: '',
      gift_type: undefined,
      gift_description: '',
      gift_image_url: '',
      quantity: undefined,
      per_person_limit: 1,
      estimated_value: undefined,
      is_exclusive: false,
    }]);
  };
  
  // 移除禮品項目
  const removeGift = (index: number) => {
    const currentGifts = form.getValues('gifts');
    if (currentGifts.length > 1) {
      form.setValue('gifts', currentGifts.filter((_, i) => i !== index));
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{promotion ? '編輯特典' : '新增特典'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="promotion_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>特典類型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇特典類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {promotionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>特典標題</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入特典標題" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>特典說明</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="輸入特典詳細說明" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="release_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>開始日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>結束日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="acquisition_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>取得方式</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="說明如何取得此特典" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="terms_and_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>注意事項</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="輸入相關條款與注意事項" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">啟用特典</FormLabel>
                      <FormDescription>
                        設定此特典是否在前台顯示
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* 禮品項目 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  禮品項目
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGift}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  新增禮品
                </Button>
              </div>
              
              {form.watch('gifts').map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">禮品 {index + 1}</h4>
                      {form.watch('gifts').length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGift(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.gift_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>禮品名稱</FormLabel>
                          <FormControl>
                            <Input placeholder="輸入禮品名稱" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.gift_type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>禮品類型</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇禮品類型" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {giftTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.gift_description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>禮品說明</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="輸入禮品詳細說明" 
                              className="min-h-[60px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.gift_image_url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>圖片網址</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`gifts.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>數量限制</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="不限制請留空" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`gifts.${index}.per_person_limit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>每人限制</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.estimated_value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>預估價值 (TWD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="輸入預估價值" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`gifts.${index}.is_exclusive`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              獨家限定
                            </FormLabel>
                            <FormDescription>
                              標記此禮品為獨家限定
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
            
            {/* 操作按鈕 */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '處理中...' : (promotion ? '更新特典' : '新增特典')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}