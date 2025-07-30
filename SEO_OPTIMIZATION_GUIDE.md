# SEO 優化完整指南

## 已完成的自動優化項目

### 1. ✅ 技術 SEO 基礎設施
- **robots.txt**: 使用 next-sitemap 自動生成，允許所有爬蟲索引
- **sitemap.xml**: 動態生成，包含所有頁面和電影詳情頁
- **server-sitemap.xml**: 支援大量動態內容的伺服器端 sitemap
- **robots meta tags**: 所有頁面都設置了正確的 index/follow 指令

### 2. ✅ Meta 標籤優化
- **標題標籤**: 所有頁面都有獨特且優化的標題
- **描述標籤**: 包含關鍵字的吸引人描述
- **關鍵字**: 涵蓋中文、英文、日文的完整關鍵字集
- **Open Graph**: 完整的社交媒體分享優化
- **Twitter Cards**: 支援大圖預覽

### 3. ✅ 結構化數據 (Schema.org)
- **Organization**: 網站組織資訊
- **Website**: 網站搜尋功能
- **Movie**: 電影詳情頁的豐富片段
- **BreadcrumbList**: 麵包屑導航（需在頁面實作）
- **FAQPage**: FAQ 結構化數據（需在頁面實作）

### 4. ✅ Next.js SSG/SSR 配置
- 首頁使用 SSG 預渲染
- 電影詳情頁使用動態 SSG
- API 數據快取優化（1小時）

### 5. ✅ 圖片優化
- 使用 Next.js Image 組件自動優化
- 設置適當的 alt 文字
- 懶加載實現

## 需要手動完成的步驟

### 1. 🔧 Google Search Console 設置

1. **訪問 Google Search Console**
   - 前往 https://search.google.com/search-console
   - 使用 Google 帳號登入

2. **新增網站資源**
   - 點擊「新增資源」
   - 選擇「網址前置字元」
   - 輸入：`https://paruparu.vercel.app`

3. **驗證網站所有權**（選擇其中一種方法）
   
   **方法 A：HTML 檔案驗證**
   - 下載 Google 提供的 HTML 驗證檔案
   - 將檔案命名為提供的檔名（如：`google1234567890abcdef.html`）
   - 將檔案放到 `/public` 目錄
   - 部署到 Vercel
   - 在 Search Console 點擊「驗證」

   **方法 B：Meta 標籤驗證**
   - 複製 Google 提供的驗證碼
   - 更新 `/src/app/layout.tsx` 中的驗證碼：
   ```typescript
   verification: {
     google: 'YOUR-VERIFICATION-CODE-HERE', // 替換為實際驗證碼
   }
   ```
   - 部署到 Vercel
   - 在 Search Console 點擊「驗證」

4. **提交 Sitemap**
   - 驗證成功後，前往「Sitemaps」
   - 提交以下 sitemap URL：
     - `https://paruparu.vercel.app/sitemap.xml`
     - `https://paruparu.vercel.app/server-sitemap.xml`

5. **監控索引狀態**
   - 檢查「覆蓋範圍」報告
   - 查看「效能」報告追蹤點擊和曝光

### 2. 🔧 Vercel 部署優化

1. **環境變數設置**
   ```bash
   # 在 Vercel 專案設置中添加
   NEXT_PUBLIC_SITE_URL=https://paruparu.vercel.app
   ```

2. **建構命令確認**
   - 確保 build 命令包含 sitemap 生成：
   ```json
   "build": "next build",
   "postbuild": "next-sitemap"
   ```

3. **重定向設置**（如需要）
   在 `next.config.ts` 中添加：
   ```typescript
   async redirects() {
     return [
       {
         source: '/index.html',
         destination: '/',
         permanent: true,
       },
     ]
   }
   ```

### 3. 🔧 內容優化建議

1. **首頁優化**
   - 添加更多描述性內容（至少 300 字）
   - 加入「關於我們」區塊
   - 添加常見問題 FAQ 區塊

2. **電影詳情頁優化**
   - 確保每個電影都有完整的描述
   - 添加用戶評論功能（增加內容豐富度）
   - 實作麵包屑導航

3. **圖片優化**
   - 創建並上傳 `/public/og-image.jpg`（1200x630px）
   - 為每個電影生成獨特的 OG 圖片
   - 確保所有圖片都有描述性的 alt 文字

### 4. 🔧 效能優化

1. **Core Web Vitals 監控**
   - 使用 PageSpeed Insights 測試
   - 優化 LCP、FID、CLS 指標

2. **快取策略**
   - 在 `next.config.ts` 設置靜態資源快取
   - 使用 Vercel Edge Cache

### 5. 🔧 外部連結建設

1. **社交媒體**
   - 創建 Facebook、Twitter 專頁
   - 在社交媒體分享網站連結

2. **本地 SEO**
   - 在 Google 我的商家註冊（如適用）
   - 提交到台灣本地目錄網站

3. **內容行銷**
   - 撰寫電影相關部落格文章
   - 與電影部落客合作

## 監控和維護

### 每週檢查
- Google Search Console 錯誤報告
- 404 錯誤頁面
- 網站載入速度

### 每月檢查
- 更新 sitemap（自動完成）
- 檢查並修復爬取錯誤
- 分析搜尋關鍵字表現

### 持續優化
- 根據 Search Console 數據優化低表現頁面
- 更新並擴展關鍵字策略
- 改善使用者體驗指標

## 檢查清單

- [ ] Google Search Console 驗證完成
- [ ] Sitemap 提交成功
- [ ] 所有頁面都能被爬取
- [ ] Open Graph 圖片已上傳
- [ ] 網站載入速度 < 3 秒
- [ ] 移動裝置友好測試通過
- [ ] 結構化數據測試無錯誤
- [ ] robots.txt 正確配置
- [ ] canonical URL 設置正確
- [ ] HTTPS 正常運作

## 有用的工具

1. **SEO 測試工具**
   - Google Search Console: https://search.google.com/search-console
   - PageSpeed Insights: https://pagespeed.web.dev/
   - Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
   - Rich Results Test: https://search.google.com/test/rich-results

2. **SEO 分析工具**
   - Google Analytics 4
   - Bing Webmaster Tools
   - SEO Chrome Extensions (SEOquake, META SEO inspector)

3. **競爭對手分析**
   - 分析類似網站的 SEO 策略
   - 研究他們的關鍵字使用
   - 學習他們的內容結構

## 下一步行動

1. 立即完成 Google Search Console 驗證
2. 上傳 og-image.jpg 圖片
3. 開始創建高質量的電影相關內容
4. 建立外部連結策略
5. 定期監控並優化網站表現

記住：SEO 是長期投資，需要持續優化和耐心等待結果！