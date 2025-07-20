'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, X, Send, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackFormData {
  type: string;
  content: string;
  email: string;
  honeypot: string; // Anti-spam field
}

const FEEDBACK_TYPES = [
  { value: 'bonus_completion', label: '特典補完' },
  { value: 'suggestion', label: '意見建議' },
  { value: 'data_correction', label: '資料修正' },
];

// 結構化郵件模板
const EMAIL_TEMPLATES = {
  bonus_completion: {
    subject: '[特典速報] 特典補完回饋',
    body: `【特典補完回饋表單】

請填寫以下資訊：

電影名稱：
[請填入電影完整名稱，例如：電影哆啦A夢：大雄的繪畫世界物語]

影城名稱：
[請填入影城名稱，例如：威秀影城、國賓影城、秀泰影城等]

特典類型：
[請填入特典類型，例如：首週購票禮、預售禮、會員禮等]

特典名稱：
[請填入完整特典名稱，例如：日本原裝進口 小畫家哆啦A夢PVC鑰匙圈]

取得方式：
[請詳細說明如何取得，例如：購買任一場次電影票2張即可兌換]

活動期間：
[請填入活動期間，例如：2025/07/18 - 2025/07/24]

數量限制：
[請填入數量限制，例如：每人限兌1個、數量有限送完為止]

資料來源：
[請提供資料來源，例如：官方FB公告、影城官網、現場海報拍照]

其他備註：
[其他重要資訊]

---
提交時間：${new Date().toLocaleString('zh-TW')}
聯絡信箱：[請填入您的聯絡信箱，方便我們聯繫]`
  },
  
  suggestion: {
    subject: '[特典速報] 功能建議回饋',
    body: `【功能建議回饋表單】

請填寫以下資訊：

建議類型：
[請選擇：新功能建議 / 現有功能改進 / 使用者介面優化 / 其他]

具體建議：
[請詳細描述您的建議內容]

使用場景：
[請說明在什麼情況下會需要這個功能]

預期效果：
[這個建議能解決什麼問題或帶來什麼便利]

優先級：
[您認為的重要程度：高 / 中 / 低]

參考範例：
[如果有其他網站或APP的類似功能，請提供參考]

其他補充：
[任何其他想法或建議]

---
提交時間：${new Date().toLocaleString('zh-TW')}
聯絡信箱：[請填入您的聯絡信箱，方便我們回覆]`
  },
  
  data_correction: {
    subject: '[特典速報] 資料修正回饋',
    body: `【資料修正回饋表單】

請填寫以下資訊：

錯誤類型：
[請選擇：電影資訊錯誤 / 特典資訊錯誤 / 影城資訊錯誤 / 其他]

電影名稱：
[請填入有問題的電影名稱]

錯誤描述：
[請詳細說明發現的錯誤內容]

正確資訊：
[請提供正確的資訊]

錯誤位置：
[請說明錯誤出現在網站的哪個頁面或區塊]

發現時間：
[您發現這個錯誤的時間]

影響程度：
[請評估：嚴重 / 中等 / 輕微]

證明資料：
[如有官方公告、截圖等證明資料，請一併提供或說明]

其他說明：
[任何其他相關資訊]

---
提交時間：${new Date().toLocaleString('zh-TW')}
聯絡信箱：[請填入您的聯絡信箱，方便我們聯繫確認]`
  }
};

// Rate limiting: Store in localStorage
const RATE_LIMIT_KEY = 'feedback_submissions';
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

interface SubmissionRecord {
  timestamp: number;
}

// Backend API configuration
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const USE_BACKEND_API = false; // 改為純 mailto 方案，提供結構化格式

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: '',
    content: '',
    email: '',
    honeypot: '', // Hidden field for spam protection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      const submissions: SubmissionRecord[] = stored ? JSON.parse(stored) : [];
      const now = Date.now();
      
      // Remove old submissions outside the window
      const recentSubmissions = submissions.filter(
        sub => now - sub.timestamp < RATE_LIMIT_WINDOW
      );
      
      // Update localStorage with cleaned data
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
      
      return recentSubmissions.length < RATE_LIMIT_COUNT;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow submission if localStorage fails
    }
  };

  const recordSubmission = (): void => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      const submissions: SubmissionRecord[] = stored ? JSON.parse(stored) : [];
      submissions.push({ timestamp: Date.now() });
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to record submission:', error);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.type) {
      toast({
        title: '錯誤',
        description: '請選擇回饋類型',
        variant: 'destructive',
      });
      return false;
    }

    // Check honeypot (should be empty)
    if (formData.honeypot) {
      toast({
        title: '錯誤',
        description: '表單驗證失敗',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const submitViaBackend = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/v1/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          content: formData.content,
          email: formData.email || null,
          honeypot: formData.honeypot,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: '回饋已送出',
        description: `謝謝您的回饋！提交編號：${result.submission_id}`,
        variant: 'default',
      });

      return true;
    } catch (error) {
      console.error('Backend submission failed:', error);
      
      // Show specific error message
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      toast({
        title: '後端發送失敗',
        description: `錯誤：${errorMessage}`,
        variant: 'destructive',
      });

      return false;
    }
  };

  const submitViaGmail = (): boolean => {
    try {
      // 取得對應的郵件模板
      const template = EMAIL_TEMPLATES[formData.type as keyof typeof EMAIL_TEMPLATES];
      
      if (!template) {
        toast({
          title: '錯誤',
          description: '找不到對應的郵件模板',
          variant: 'destructive',
        });
        return false;
      }

      // 根據用戶是否填寫內容來調整模板
      let emailBody = template.body;
      
      // 如果用戶有填寫額外內容，附加到模板末尾
      if (formData.content && formData.content.trim()) {
        emailBody += `\n\n【使用者補充資訊】\n${formData.content.trim()}`;
      }
      
      // 如果用戶有填寫聯絡信箱，替換模板中的提示
      if (formData.email && formData.email.trim()) {
        emailBody = emailBody.replace(
          '[請填入您的聯絡信箱，方便我們聯繫]',
          formData.email
        ).replace(
          '[請填入您的聯絡信箱，方便我們回覆]',
          formData.email
        ).replace(
          '[請填入您的聯絡信箱，方便我們聯繫確認]',
          formData.email
        );
      }

      // 建立 Gmail 撰寫連結
      const gmailUrl = new URL('https://mail.google.com/mail/');
      gmailUrl.searchParams.set('view', 'cm');
      gmailUrl.searchParams.set('to', 'vmgsahm1@gmail.com');
      gmailUrl.searchParams.set('su', template.subject);
      gmailUrl.searchParams.set('body', emailBody);
      
      // 在新分頁開啟 Gmail
      window.open(gmailUrl.toString(), '_blank');

      toast({
        title: '已開啟 Gmail',
        description: '請在 Gmail 中填寫表單並送出。謝謝您的回饋！',
        variant: 'default',
      });

      return true;
    } catch (error) {
      console.error('Gmail failed:', error);
      toast({
        title: '發送失敗',
        description: '無法開啟 Gmail，請稍後再試',
        variant: 'destructive',
      });
      return false;
    }
  };

  const submitViaMailto = (): boolean => {
    try {
      // 取得對應的郵件模板
      const template = EMAIL_TEMPLATES[formData.type as keyof typeof EMAIL_TEMPLATES];
      
      if (!template) {
        return false;
      }

      // 根據用戶是否填寫內容來調整模板
      let emailBody = template.body;
      
      if (formData.content && formData.content.trim()) {
        emailBody += `\n\n【使用者補充資訊】\n${formData.content.trim()}`;
      }
      
      if (formData.email && formData.email.trim()) {
        emailBody = emailBody.replace(
          /\[請填入您的聯絡信箱[^\]]*\]/g,
          formData.email
        );
      }

      // 建立 mailto 連結作為備援
      const mailtoLink = `mailto:vmgsahm1@gmail.com?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      return true;
    } catch (error) {
      console.error('Mailto failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!checkRateLimit()) {
      toast({
        title: '提交限制',
        description: '您的提交過於頻繁，請稍後再試（每小時限制 3 次）',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 使用 Gmail 方案
      const success = submitViaGmail();

      if (success) {
        // Record successful submission
        recordSubmission();

        // Reset form and close
        setFormData({
          type: '',
          content: '',
          email: '',
          honeypot: '',
        });
        setIsOpen(false);
      }

    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: '發送失敗',
        description: '提交過程中發生錯誤，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Close form when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="開啟回饋表單"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Feedback Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-accent" />
                      <CardTitle className="text-lg">使用者回饋</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="feedback-type">回饋類型 *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇回饋類型" />
                        </SelectTrigger>
                        <SelectContent>
                          {FEEDBACK_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor="feedback-content">補充說明 (可選)</Label>
                      <Textarea
                        id="feedback-content"
                        placeholder="如有額外補充資訊，請在此填寫..."
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        此欄位為可選，系統會提供結構化表單供您填寫
                      </p>
                    </div>
                    
                    {/* 預覽郵件內容 */}
                    {formData.type && (
                      <div className="space-y-2">
                        <Label>📧 郵件預覽</Label>
                        <div className="bg-muted/50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
                          <p className="font-medium text-xs text-muted-foreground mb-2">
                            主旨：{EMAIL_TEMPLATES[formData.type as keyof typeof EMAIL_TEMPLATES]?.subject}
                          </p>
                          <div className="text-xs whitespace-pre-wrap opacity-70">
                            {EMAIL_TEMPLATES[formData.type as keyof typeof EMAIL_TEMPLATES]?.body.substring(0, 200)}...
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          點擊「開啟 Gmail」後會在新分頁開啟 Gmail 撰寫頁面，您可以在結構化表單中填寫詳細資訊
                        </p>
                      </div>
                    )}

                    {/* Email (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="feedback-email">聯絡信箱 (可選)</Label>
                      <Input
                        id="feedback-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        若需要回覆，請提供您的信箱
                      </p>
                    </div>

                    {/* Honeypot field - hidden from users */}
                    <input
                      type="text"
                      style={{ display: 'none' }}
                      value={formData.honeypot}
                      onChange={(e) => handleInputChange('honeypot', e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          '開啟中...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            開啟 Gmail
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}