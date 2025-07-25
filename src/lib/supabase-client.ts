import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pcyggzipdpieiffithio.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjeWdnemlwZHBpZWlmZml0aGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzU5OTksImV4cCI6MjA2Nzc1MTk5OX0.Jm3L9Z-z15W-kyWTFaArf91cGM0Wr5TyZV2gbIF3MQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 回報相關的類型定義
export interface FeedbackSubmission {
  feedback_type: string;
  title?: string;
  content: string;
  contact_email?: string;
  contact_name?: string;
  honeypot?: string;
  user_agent?: string;
  referrer_url?: string;
}

export interface BonusCompletionDetails {
  movie_title?: string;
  movie_english_title?: string;
  cinema_name?: string;
  bonus_type?: string;
  bonus_name?: string;
  bonus_description?: string;
  acquisition_method?: string;
  activity_period_start?: string;
  activity_period_end?: string;
  quantity_limit?: string;
  source_type?: string;
  source_url?: string;
  source_description?: string;
}

// 提交回報到 Supabase
export async function submitFeedback(
  feedbackData: FeedbackSubmission,
  bonusDetails?: BonusCompletionDetails
) {
  try {
    // 1. 插入主要回報資料
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedbacks')
      .insert([{
        feedback_type: feedbackData.feedback_type,
        title: feedbackData.title,
        content: feedbackData.content,
        contact_email: feedbackData.contact_email,
        contact_name: feedbackData.contact_name,
        honeypot: feedbackData.honeypot || '',
        user_agent: feedbackData.user_agent,
        referrer_url: feedbackData.referrer_url,
      }])
      .select()
      .single();

    if (feedbackError) {
      throw new Error(`Failed to submit feedback: ${feedbackError.message}`);
    }

    // 2. 如果是特典補完，插入詳細資料
    if (feedbackData.feedback_type === 'bonus_completion' && bonusDetails && feedback) {
      const { error: bonusError } = await supabase
        .from('bonus_completion_details')
        .insert([{
          feedback_id: feedback.id,
          ...bonusDetails,
        }]);

      if (bonusError) {
        console.error('Failed to insert bonus completion details:', bonusError);
        // 不拋出錯誤，因為主要回報已經成功
      }
    }

    // 3. 記錄活動日誌
    await supabase
      .from('feedback_activity_logs')
      .insert([{
        feedback_id: feedback.id,
        action: 'created',
        new_value: 'pending',
        comment: 'Feedback submitted by user',
      }]);

    return {
      success: true,
      submission_id: feedback.submission_id,
      feedback_id: feedback.id,
    };

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// 獲取回報類型列表
export async function getFeedbackTypes() {
  try {
    const { data, error } = await supabase
      .from('feedback_types')
      .select('type_code, type_name, description')
      .eq('is_active', true)
      .order('type_name');

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching feedback types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: [],
    };
  }
}

// 檢查回報狀態 (根據 submission_id)
export async function getFeedbackStatus(submissionId: string) {
  try {
    const { data, error } = await supabase
      .from('feedback_overview')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching feedback status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null,
    };
  }
}