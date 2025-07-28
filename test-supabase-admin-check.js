// 檢查 Supabase 連線和 admin_users 資料
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 顏色輸出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkSupabaseConnection() {
  log('\n=== Supabase Admin 連線檢查 ===', 'blue');
  
  // 檢查環境變數
  log('\n檢查環境變數:', 'yellow');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ 已設定' : '✗ 未設定'}`, supabaseUrl ? 'green' : 'red');
  log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✓ 已設定' : '✗ 未設定'}`, supabaseServiceKey ? 'green' : 'red');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    log('\n錯誤：缺少必要的環境變數！', 'red');
    log('請確認 .env.local 檔案包含正確的設定', 'yellow');
    return;
  }
  
  // 建立 Supabase Admin Client
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    // 1. 檢查 admin_users 表
    log('\n檢查 admin_users 表:', 'yellow');
    const { data: adminUsers, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*');
    
    if (adminError) {
      log(`✗ 無法查詢 admin_users 表: ${adminError.message}`, 'red');
    } else {
      log(`✓ 成功連接到 admin_users 表`, 'green');
      log(`  找到 ${adminUsers.length} 個管理員帳號:`, 'green');
      adminUsers.forEach((user, index) => {
        log(`  ${index + 1}. ${user.email} (${user.name}) - 狀態: ${user.is_active ? '啟用' : '停用'}`, user.is_active ? 'green' : 'yellow');
      });
    }
    
    // 2. 檢查 admin_sessions 表
    log('\n檢查 admin_sessions 表:', 'yellow');
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .limit(5)
      .order('created_at', { ascending: false });
    
    if (sessionError) {
      log(`✗ 無法查詢 admin_sessions 表: ${sessionError.message}`, 'red');
      
      // 如果表不存在，提供創建語法
      if (sessionError.message.includes('relation') && sessionError.message.includes('does not exist')) {
        log('\n需要創建 admin_sessions 表，請執行以下 SQL:', 'yellow');
        log(`
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 創建索引以提高查詢效能
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- 設定 RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- 只允許 service role 存取
CREATE POLICY "Service role can manage sessions" ON admin_sessions
  FOR ALL TO service_role
  USING (true);
        `, 'blue');
      }
    } else {
      log(`✓ 成功連接到 admin_sessions 表`, 'green');
      log(`  最近 ${sessions.length} 個會話記錄`, 'green');
    }
    
    // 3. 測試身份驗證
    log('\n測試身份驗證功能:', 'yellow');
    const testEmail = 'admin@example.com';
    const testPassword = 'securepassword123';
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (authError) {
      log(`✗ 無法使用測試帳號登入: ${authError.message}`, 'red');
      
      if (authError.message === 'Invalid login credentials') {
        log('\n建議：請確認測試帳號存在且密碼正確', 'yellow');
        log('或使用以下命令創建測試帳號:', 'yellow');
        log(`
// 在 Supabase Dashboard 執行以下 SQL
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('securepassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- 然後在 admin_users 表中添加對應記錄
INSERT INTO admin_users (id, email, name, is_active)
SELECT id, email, 'Test Admin', true
FROM auth.users
WHERE email = 'admin@example.com';
        `, 'blue');
      }
    } else {
      log(`✓ 成功使用測試帳號登入`, 'green');
      log(`  用戶 ID: ${authData.user.id}`, 'green');
      
      // 登出
      await supabaseAdmin.auth.signOut();
    }
    
  } catch (error) {
    log(`\n發生錯誤: ${error.message}`, 'red');
    console.error(error);
  }
}

// 執行檢查
log('=== MovieBonus Supabase Admin 診斷工具 ===', 'blue');
log(`執行時間: ${new Date().toLocaleString('zh-TW')}`, 'yellow');

checkSupabaseConnection();