-- ===================================================
-- 回報功能 Supabase 資料表設計
-- ===================================================

-- 1. 回報類型參考表 (可選，如果想要固定回報類型)
CREATE TABLE feedback_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type_code VARCHAR(50) UNIQUE NOT NULL,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入預設的回報類型
INSERT INTO feedback_types (type_code, type_name, description) VALUES
('bonus_completion', '特典補完', '回報新的電影特典資訊或補充遺漏的特典資料'),
('suggestion', '意見建議', '對網站功能或服務的改進建議'),
('data_correction', '資料修正', '回報錯誤的電影或特典資訊');

-- 2. 主要回報表
CREATE TABLE user_feedbacks (
  -- 基本欄位
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id VARCHAR(20) UNIQUE NOT NULL, -- 用戶可見的簡短 ID
  
  -- 回報內容
  feedback_type VARCHAR(50) NOT NULL REFERENCES feedback_types(type_code),
  title VARCHAR(200), -- 回報標題 (可選)
  content TEXT NOT NULL, -- 回報內容
  
  -- 聯絡資訊
  contact_email VARCHAR(255), -- 聯絡信箱 (可選)
  contact_name VARCHAR(100), -- 聯絡人姓名 (可選)
  
  -- 反垃圾郵件
  honeypot VARCHAR(255) DEFAULT '', -- 蜜罐欄位，應該為空
  
  -- 技術資訊
  user_agent TEXT, -- 瀏覽器資訊
  ip_address INET, -- IP 位址 (可能需要考慮隱私)
  referrer_url TEXT, -- 來源頁面
  
  -- 狀態管理
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed', 'spam')),
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- 管理員備註
  admin_notes TEXT,
  assigned_to UUID, -- 如果有管理員系統的話
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  
  -- 時間戳記
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 回報附件表 (如果需要支援檔案上傳)
CREATE TABLE feedback_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES user_feedbacks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  file_url TEXT NOT NULL, -- Supabase Storage URL
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 回報處理記錄表 (追蹤處理歷程)
CREATE TABLE feedback_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES user_feedbacks(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'created', 'status_changed', 'assigned', 'commented', etc.
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  created_by UUID, -- 操作者 (系統或管理員)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 特典補完專用表 (針對特典補完類型的結構化資料)
CREATE TABLE bonus_completion_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES user_feedbacks(id) ON DELETE CASCADE,
  
  -- 電影資訊
  movie_title VARCHAR(200),
  movie_english_title VARCHAR(200),
  cinema_name VARCHAR(100),
  
  -- 特典資訊
  bonus_type VARCHAR(100), -- 首週購票禮、預售禮、會員禮等
  bonus_name VARCHAR(200),
  bonus_description TEXT,
  
  -- 取得條件
  acquisition_method TEXT,
  activity_period_start DATE,
  activity_period_end DATE,
  quantity_limit VARCHAR(100),
  
  -- 資料來源
  source_type VARCHAR(50), -- 'official_website', 'facebook', 'on_site', 'other'
  source_url TEXT,
  source_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- 索引設定
-- ===================================================

-- 主要查詢索引
CREATE INDEX idx_user_feedbacks_status ON user_feedbacks(status);
CREATE INDEX idx_user_feedbacks_type ON user_feedbacks(feedback_type);
CREATE INDEX idx_user_feedbacks_created ON user_feedbacks(created_at DESC);
CREATE INDEX idx_user_feedbacks_submission_id ON user_feedbacks(submission_id);

-- 活動記錄索引
CREATE INDEX idx_feedback_logs_feedback_id ON feedback_activity_logs(feedback_id);
CREATE INDEX idx_feedback_logs_created ON feedback_activity_logs(created_at DESC);

-- 特典補完索引
CREATE INDEX idx_bonus_completion_movie ON bonus_completion_details(movie_title);
CREATE INDEX idx_bonus_completion_feedback ON bonus_completion_details(feedback_id);

-- ===================================================
-- 觸發器 (自動更新 updated_at)
-- ===================================================

-- 為主要表格建立自動更新 updated_at 的觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_feedbacks_updated_at 
  BEFORE UPDATE ON user_feedbacks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_types_updated_at 
  BEFORE UPDATE ON feedback_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================
-- 自動生成 submission_id 的函數
-- ===================================================

CREATE OR REPLACE FUNCTION generate_submission_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'FB';
    i INTEGER;
BEGIN
    -- 生成格式: FB + 6位隨機英數字 (例如: FB7K9M2P)
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    
    -- 確保不重複
    WHILE EXISTS (SELECT 1 FROM user_feedbacks WHERE submission_id = result) LOOP
        result := 'FB';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 為新回報自動生成 submission_id
CREATE OR REPLACE FUNCTION set_submission_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.submission_id IS NULL OR NEW.submission_id = '' THEN
        NEW.submission_id := generate_submission_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_feedback_submission_id
    BEFORE INSERT ON user_feedbacks
    FOR EACH ROW EXECUTE FUNCTION set_submission_id();

-- ===================================================
-- RLS (Row Level Security) 政策 (可選)
-- ===================================================

-- 如果需要啟用 RLS，可以設定適當的政策
-- ALTER TABLE user_feedbacks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE feedback_attachments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE feedback_activity_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bonus_completion_details ENABLE ROW LEVEL SECURITY;

-- 例如：允許任何人插入回報，但只有管理員可以讀取
-- CREATE POLICY "Anyone can insert feedback" ON user_feedbacks FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Only admins can select feedback" ON user_feedbacks FOR SELECT USING (auth.role() = 'admin');

-- ===================================================
-- 檢視表 (方便查詢)
-- ===================================================

-- 回報總覽檢視
CREATE VIEW feedback_overview AS
SELECT 
    uf.id,
    uf.submission_id,
    ft.type_name,
    uf.title,
    LEFT(uf.content, 100) || CASE WHEN LENGTH(uf.content) > 100 THEN '...' ELSE '' END as content_preview,
    uf.contact_email,
    uf.status,
    uf.priority,
    uf.created_at,
    uf.updated_at,
    (SELECT COUNT(*) FROM feedback_attachments fa WHERE fa.feedback_id = uf.id) as attachment_count
FROM user_feedbacks uf
JOIN feedback_types ft ON uf.feedback_type = ft.type_code
ORDER BY uf.created_at DESC;

-- 待處理回報統計
CREATE VIEW feedback_stats AS
SELECT 
    ft.type_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN uf.status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN uf.status = 'in_progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN uf.status = 'resolved' THEN 1 END) as resolved_count
FROM user_feedbacks uf
JOIN feedback_types ft ON uf.feedback_type = ft.type_code
GROUP BY ft.type_name, ft.type_code
ORDER BY total_count DESC;

-- ===================================================
-- 使用說明
-- ===================================================

/*
1. 建立資料表：
   複製上面的 SQL 指令到 Supabase SQL 編輯器執行

2. API 權限設定：
   在 Supabase Dashboard 中設定適當的 API 權限

3. 前端整合：
   使用 Supabase JavaScript SDK 來插入和查詢資料

4. 管理後台：
   可以使用 Supabase Dashboard 或建立自訂管理介面

範例查詢：
-- 取得最新的 10 個回報
SELECT * FROM feedback_overview LIMIT 10;

-- 取得特定類型的回報
SELECT * FROM user_feedbacks WHERE feedback_type = 'bonus_completion';

-- 取得回報統計
SELECT * FROM feedback_stats;
*/