'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Save,
  X,
  Link2,
  FileText,
  Calendar,
  MapPin,
  Gift,
} from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api-client-admin';
import { handleApiError } from '@/lib/api-client';

interface BonusLinkProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackId: string;
  facebookUrl: string;
  bonusDetails?: {
    movie_title?: string;
    movie_english_title?: string;
    cinema_name?: string;
    bonus_type?: string;
    bonus_name?: string;
  };
  onProcessComplete?: () => void;
}

interface ProcessingResult {
  status: 'idle' | 'processing' | 'success' | 'error';
  data?: {
    postContent?: string;
    extractedTime?: string;
    bonusInfo?: {
      movieTitle?: string;
      bonusType?: string;
      bonusName?: string;
      description?: string;
      period?: {
        start?: string;
        end?: string;
      };
      location?: string;
      quantity?: string;
      acquisitionMethod?: string;
    };
  };
  error?: string;
  processedAt?: string;
}

export function BonusLinkProcessModal({
  open,
  onOpenChange,
  feedbackId,
  facebookUrl,
  bonusDetails,
  onProcessComplete,
}: BonusLinkProcessModalProps) {
  const { toast } = useToast();
  const [processingResult, setProcessingResult] = useState<ProcessingResult>({
    status: 'idle',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setProcessingResult({ status: 'idle' });
      setIsSaving(false);
      setIsProcessed(false);
    }
  }, [open]);

  // Process Facebook link
  const processLink = async () => {
    setProcessingResult({ status: 'processing' });

    try {
      // Call n8n webhook
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/process-facebook-link';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: facebookUrl,
          feedbackId: feedbackId,
          existingBonusDetails: bonusDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const result = await response.json();

      // Simulate processing result for now
      // In real implementation, this would come from n8n webhook response
      setProcessingResult({
        status: 'success',
        data: {
          postContent: result.postContent || '這是從 Facebook 貼文擷取的內容範例...',
          extractedTime: result.extractedTime || new Date().toISOString(),
          bonusInfo: {
            movieTitle: result.movieTitle || bonusDetails?.movie_title || '未知電影',
            bonusType: result.bonusType || bonusDetails?.bonus_type || '特典',
            bonusName: result.bonusName || bonusDetails?.bonus_name || '特典名稱',
            description: result.description || '特典描述內容',
            period: {
              start: result.periodStart,
              end: result.periodEnd,
            },
            location: result.location || bonusDetails?.cinema_name,
            quantity: result.quantity,
            acquisitionMethod: result.acquisitionMethod || '購票即贈',
          },
        },
        processedAt: new Date().toISOString(),
      });

      toast({
        title: '處理成功',
        description: '已成功擷取 Facebook 貼文內容',
      });
    } catch (error) {
      console.error('Error processing link:', error);
      setProcessingResult({
        status: 'error',
        error: error instanceof Error ? error.message : '處理連結時發生錯誤',
      });

      toast({
        title: '處理失敗',
        description: '無法處理 Facebook 連結，請稍後再試',
        variant: 'destructive',
      });
    }
  };

  // Save processed data
  const saveProcessedData = async () => {
    if (!processingResult.data?.bonusInfo) return;
    
    setIsSaving(true);

    try {
      // Save the extracted bonus information to the database
      const response = await adminApi.feedbacks.saveBonusData(feedbackId, {
        movieTitle: processingResult.data.bonusInfo.movieTitle,
        movieEnglishTitle: bonusDetails?.movie_english_title,
        cinemaName: processingResult.data.bonusInfo.location || bonusDetails?.cinema_name,
        bonusType: processingResult.data.bonusInfo.bonusType,
        bonusName: processingResult.data.bonusInfo.bonusName,
        bonusDescription: processingResult.data.bonusInfo.description,
        acquisitionMethod: processingResult.data.bonusInfo.acquisitionMethod,
        activityPeriodStart: processingResult.data.bonusInfo.period?.start,
        activityPeriodEnd: processingResult.data.bonusInfo.period?.end,
        quantityLimit: processingResult.data.bonusInfo.quantity,
        sourceUrl: facebookUrl,
        processedAt: processingResult.processedAt,
        extractedContent: processingResult.data.postContent,
      });

      if (response.success) {
        toast({
          title: '儲存成功',
          description: '特典資訊已成功儲存',
        });

        setIsProcessed(true);
        
        // Call onProcessComplete callback if provided
        if (onProcessComplete) {
          onProcessComplete();
        }

        // Close modal after short delay
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        throw new Error(response.error || '儲存失敗');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      const errorMessage = handleApiError(error);
      toast({
        title: '儲存失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Mark as processed without saving
  const markAsProcessed = async () => {
    try {
      // Update feedback status to indicate it has been processed
      const response = await adminApi.feedbacks.update(feedbackId, {
        status: 'resolved',
        admin_notes: `已處理 Facebook 連結 (${format(new Date(), 'yyyy/MM/dd HH:mm', { locale: zhTW })})`,
      });

      if (response.success) {
        toast({
          title: '標記成功',
          description: '已將此回報標記為已處理',
        });

        if (onProcessComplete) {
          onProcessComplete();
        }

        onOpenChange(false);
      } else {
        throw new Error(response.error || '標記失敗');
      }
    } catch (error) {
      console.error('Error marking as processed:', error);
      const errorMessage = handleApiError(error);
      toast({
        title: '標記失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = () => {
    switch (processingResult.status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (processingResult.status) {
      case 'processing':
        return <Badge variant="default">處理中</Badge>;
      case 'success':
        return <Badge variant="success">處理完成</Badge>;
      case 'error':
        return <Badge variant="destructive">處理失敗</Badge>;
      default:
        return <Badge variant="outline">待處理</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>特典連結處理</DialogTitle>
          <DialogDescription>
            處理 Facebook 連結並擷取特典資訊
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                連結預覽
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 truncate max-w-[70%]"
                >
                  {facebookUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <Button
                  size="sm"
                  variant={processingResult.status === 'idle' ? 'default' : 'outline'}
                  onClick={processLink}
                  disabled={processingResult.status === 'processing' || processingResult.status === 'success'}
                >
                  {processingResult.status === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      處理中...
                    </>
                  ) : processingResult.status === 'success' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      已處理
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      開始處理
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {getStatusIcon()}
                  處理狀態
                </span>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processingResult.status === 'processing' && (
                <div className="text-sm text-muted-foreground">
                  正在擷取 Facebook 貼文內容，請稍候...
                </div>
              )}
              {processingResult.status === 'success' && processingResult.processedAt && (
                <div className="text-sm text-muted-foreground">
                  處理完成於 {format(new Date(processingResult.processedAt), 'yyyy/MM/dd HH:mm:ss', { locale: zhTW })}
                </div>
              )}
              {processingResult.status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{processingResult.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Processing Result */}
          {processingResult.status === 'success' && processingResult.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">處理結果</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">貼文內容</TabsTrigger>
                    <TabsTrigger value="extracted">擷取資訊</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-4">
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <FileText className="h-4 w-4" />
                            原始貼文內容
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {processingResult.data.postContent}
                          </p>
                        </div>
                        {processingResult.data.extractedTime && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Clock className="h-4 w-4" />
                              發布時間
                            </div>
                            <p className="text-sm">
                              {format(new Date(processingResult.data.extractedTime), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="extracted" className="mt-4">
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      {processingResult.data.bonusInfo && (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Gift className="h-4 w-4" />
                              特典資訊
                            </div>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">電影名稱</dt>
                                <dd className="text-sm">{processingResult.data.bonusInfo.movieTitle}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">特典類型</dt>
                                <dd className="text-sm">{processingResult.data.bonusInfo.bonusType}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">特典名稱</dt>
                                <dd className="text-sm">{processingResult.data.bonusInfo.bonusName}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">特典描述</dt>
                                <dd className="text-sm">{processingResult.data.bonusInfo.description}</dd>
                              </div>
                              {processingResult.data.bonusInfo.acquisitionMethod && (
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">取得方式</dt>
                                  <dd className="text-sm">{processingResult.data.bonusInfo.acquisitionMethod}</dd>
                                </div>
                              )}
                            </dl>
                          </div>

                          <Separator />

                          {(processingResult.data.bonusInfo.period?.start || processingResult.data.bonusInfo.period?.end) && (
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Calendar className="h-4 w-4" />
                                活動期間
                              </div>
                              <p className="text-sm">
                                {processingResult.data.bonusInfo.period.start && 
                                  format(new Date(processingResult.data.bonusInfo.period.start), 'yyyy/MM/dd', { locale: zhTW })
                                }
                                {processingResult.data.bonusInfo.period.start && processingResult.data.bonusInfo.period.end && ' ~ '}
                                {processingResult.data.bonusInfo.period.end && 
                                  format(new Date(processingResult.data.bonusInfo.period.end), 'yyyy/MM/dd', { locale: zhTW })
                                }
                              </p>
                            </div>
                          )}

                          {processingResult.data.bonusInfo.location && (
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <MapPin className="h-4 w-4" />
                                地點
                              </div>
                              <p className="text-sm">{processingResult.data.bonusInfo.location}</p>
                            </div>
                          )}

                          {processingResult.data.bonusInfo.quantity && (
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">數量限制</div>
                              <p className="text-sm">{processingResult.data.bonusInfo.quantity}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            關閉
          </Button>
          
          <div className="flex gap-2">
            {processingResult.status === 'success' && (
              <>
                <Button
                  variant="outline"
                  onClick={markAsProcessed}
                  disabled={isSaving || isProcessed}
                >
                  標記為已處理
                </Button>
                <Button
                  onClick={saveProcessedData}
                  disabled={isSaving || isProcessed}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      儲存中...
                    </>
                  ) : isProcessed ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      已儲存
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      儲存特典資訊
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}