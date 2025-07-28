'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, X, Send } from 'lucide-react';
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

// Backend API configuration
const BACKEND_API_URL = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000';

export default function FeedbackFormNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: '',
    content: '',
    email: '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.type) {
      toast({
        title: '❗ 錯誤',
        description: '請選擇回饋類型',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content || formData.content.trim().length === 0) {
      toast({
        title: '❗ 錯誤',
        description: '請填寫回饋內容',
        variant: 'destructive',
      });
      return;
    }

    // Check honeypot
    if (formData.honeypot) {
      toast({
        title: '❗ 錯誤',
        description: '表單驗證失敗',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: formData.type,
          content: formData.content,
          email: formData.email || null,
          honeypot: formData.honeypot,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        toast({
          title: '✅ 回饋已送出',
          description: result.message || '感謝您的寶貴意見！',
          variant: 'default',
          duration: 5000,
        });

        // Reset form and close
        setTimeout(() => {
          setFormData({
            type: '',
            content: '',
            email: '',
            honeypot: '',
          });
          setIsOpen(false);
        }, 500);
      } else {
        // Error
        toast({
          title: '❌ 發送失敗',
          description: result.error || '提交過程中發生錯誤',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: '❌ 網路錯誤',
        description: '無法連接到伺服器，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on escape
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
                    <CardTitle className="text-lg">使用者回饋</CardTitle>
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
                      <Label htmlFor="feedback-content">回饋內容 *</Label>
                      <Textarea
                        id="feedback-content"
                        placeholder={
                          formData.type === 'bonus_completion' 
                            ? "請說明電影名稱、影城、特典內容等資訊..."
                            : formData.type === 'suggestion'
                            ? "請詳細說明您的建議..."
                            : formData.type === 'data_correction'
                            ? "請說明需要修正的內容..."
                            : "請輸入您的回饋內容..."
                        }
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={4}
                        className="resize-none"
                        required
                      />
                    </div>

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
                        disabled={isSubmitting || !formData.type || !formData.content}
                        className="flex-1 transition-all"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            送出中...
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            送出回饋
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