# MovieBonus Frontend 部署檢查清單

## 🔐 環境變數配置 (Vercel)

### 必須設定的環境變數：
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase 專案 URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名金鑰
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服務角色金鑰（用於 API routes）
- [ ] `NEXT_PUBLIC_API_URL` - Python 爬蟲服務 API URL
- [ ] `NEXT_PUBLIC_API_TIMEOUT` - API 超時設定（建議：30000）
- [ ] `NEXT_PUBLIC_APP_NAME` - 應用程式名稱
- [ ] `NEXT_PUBLIC_APP_VERSION` - 應用程式版本
- [ ] `NEXT_PUBLIC_APP_ENV` - 環境（production）

### 選用環境變數：
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID（如有使用）
- [ ] `NEXT_PUBLIC_ENABLE_SEARCH` - 搜尋功能開關
- [ ] `NEXT_PUBLIC_ENABLE_CACHE` - 快取功能開關
- [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS` - 分析功能開關

## 📝 資料庫準備

### Admin 相關資料表：
```sql
-- 確認以下資料表已建立：
-- 1. admin_users - 管理員使用者表
-- 2. admin_sessions - 管理員 session 表
-- 3. user_feedback - 使用者回饋表
```

### 初始管理員設定：
1. 在 Supabase Auth 建立管理員帳號
2. 將使用者 ID 加入 `admin_users` 表
3. 設定 `is_active = true`

## 🚀 部署前檢查

### 程式碼檢查：
- [ ] 確認所有 TypeScript 錯誤已修正
- [ ] 確認 ESLint 沒有嚴重錯誤
- [ ] 移除所有 console.log（生產環境）
- [ ] 確認錯誤處理完善

### 安全性檢查：
- [ ] CSRF token 機制正常運作
- [ ] Session 過期時間合理（當前：24小時）
- [ ] Rate limiting 設定適當（當前：15分鐘內最多5次）
- [ ] 所有敏感資料都使用環境變數

### 效能優化：
- [ ] 圖片優化已正確設定（當前：已禁用 Next.js 優化）
- [ ] 靜態資源快取設定（當前：31536000秒）
- [ ] API timeout 設定合理（當前：30秒）

## 🌐 Vercel 專案設定

### Build & Development Settings：
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Functions Configuration：
- Region: Hong Kong (hkg1)
- Max Duration: 30 seconds (for movie pages)

### Domain Settings：
- [ ] 設定自訂網域（如有）
- [ ] 啟用 HTTPS（自動）
- [ ] 設定 CORS（如需要）

## 🧪 部署後測試

### 功能測試：
- [ ] 管理員登入功能
- [ ] CSRF token 取得與驗證
- [ ] Session 管理（登入/登出）
- [ ] 401 錯誤自動跳轉登入頁
- [ ] Rate limiting 運作

### 使用者體驗測試：
- [ ] 錯誤訊息顯示正確（中文）
- [ ] Loading 狀態顯示
- [ ] 網路錯誤處理
- [ ] 行動裝置響應式設計

### 效能測試：
- [ ] 首頁載入時間 < 3秒
- [ ] API 響應時間合理
- [ ] 圖片載入正常

## 📊 監控設定

### 錯誤追蹤：
- [ ] Vercel Analytics 啟用
- [ ] 錯誤日誌檢視設定
- [ ] 自訂錯誤追蹤（如 Sentry）

### 效能監控：
- [ ] Core Web Vitals 監控
- [ ] API 響應時間監控
- [ ] 使用者行為分析

## 🔄 持續部署

### Git 整合：
- [ ] 連結 GitHub repository
- [ ] 設定自動部署（main branch）
- [ ] Preview deployments 啟用

### 部署通知：
- [ ] 部署成功/失敗通知
- [ ] 團隊成員權限設定

## 📋 其他注意事項

1. **CSRF Token 過期處理**：前端已實作自動重新取得機制
2. **Session 管理**：使用資料庫儲存，支援多裝置登入追蹤
3. **圖片處理**：已完全禁用 Next.js 圖片優化，使用原始 URL
4. **錯誤邊界**：已實作全域錯誤處理元件

## 🚨 緊急聯絡

- 技術問題：[技術團隊聯絡方式]
- Vercel 支援：https://vercel.com/support
- Supabase 支援：https://supabase.com/support