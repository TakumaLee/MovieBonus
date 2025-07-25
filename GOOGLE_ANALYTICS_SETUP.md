# Google Analytics 設定指南

已成功在 MovieBonus 前端專案中集成 Google Analytics (GA4)。

## 🚀 完成的功能

### 1. GA4 追蹤代碼
- ✅ 安裝並配置 `gtag` 套件
- ✅ 建立 `GoogleAnalytics` 組件自動追蹤頁面瀏覽
- ✅ 配置環境變數支援
- ✅ 生產環境才載入 GA (開發環境不會載入)

### 2. 自定義事件追蹤
- ✅ **電影搜尋**: 追蹤用戶搜尋的關鍵詞
- ✅ **電影查看**: 追蹤用戶點擊查看的電影
- ✅ **特典查看**: 追蹤特典詳情查看
- ✅ **外部連結**: 追蹤外部連結點擊
- ✅ **反饋提交**: 追蹤反饋表單提交

### 3. 檔案結構
```
src/
├── lib/
│   └── gtag.ts          # GA 配置和事件追蹤函數
├── components/
│   ├── GoogleAnalytics.tsx  # GA 組件
│   ├── SearchBar.tsx    # 已加入搜尋事件追蹤
│   └── FeedbackForm.tsx # 已加入反饋事件追蹤
└── app/
    └── layout.tsx       # 已整合 GoogleAnalytics 組件
```

## 🔧 設定步驟

### 1. 建立 Google Analytics 屬性
1. 前往 [Google Analytics](https://analytics.google.com/)
2. 建立新的帳戶或選擇現有帳戶
3. 建立新的「GA4 屬性」
4. 設定資料串流，選擇「網站」
5. 輸入網站 URL：`https://paruparu.vercel.app`
6. 複製「測量 ID」(格式：G-XXXXXXXXXX)

### 2. 設定環境變數
編輯 `.env.local` 檔案：
```bash
# 將 YOUR_GA_MEASUREMENT_ID 替換為實際的測量 ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 3. 部署和測試
```bash
npm run build
npm run start
```

## 📊 事件追蹤設定

### 已設定的事件
| 事件名稱 | 觸發時機 | 參數 |
|---------|---------|------|
| `search` | 用戶搜尋電影 | `event_category: Movie`, `event_label: 搜尋關鍵詞` |
| `view_movie` | 用戶點擊電影 | `event_category: Movie`, `event_label: 電影標題` |
| `view_promotion` | 用戶查看特典 | `event_category: Promotion`, `event_label: 特典標題` |
| `click` | 點擊外部連結 | `event_category: External Link`, `event_label: URL` |
| `submit` | 提交反饋 | `event_category: Feedback`, `event_label: 反饋類型` |

### 自定義事件用法
```typescript
import { trackEvent } from '@/lib/gtag';

// 追蹤電影搜尋
trackEvent.movieSearch('全知讀者視角');

// 追蹤電影查看
trackEvent.movieView('壞蛋聯盟 2');

// 追蹤特典查看
trackEvent.promotionView('首週購票禮');

// 追蹤外部連結
trackEvent.externalLink('https://www.vscinemas.com.tw');

// 追蹤反饋提交
trackEvent.feedbackSubmit('bonus_completion');
```

## 🔍 驗證設定

### 1. 開發環境測試
```bash
# 設定測試環境變數
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production

npm run dev
```

### 2. 瀏覽器開發者工具
1. 開啟 Chrome DevTools
2. 切換到 **Network** 標籤
3. 過濾 `google-analytics.com` 或 `gtag`
4. 瀏覽網站並執行操作
5. 檢查是否有 GA 請求發送

### 3. Google Analytics 即時報表
1. 前往 Google Analytics
2. 選擇「即時」報表
3. 瀏覽網站進行測試
4. 檢查即時用戶和事件

## 📈 可追蹤的數據

### 自動追蹤
- ✅ 頁面瀏覽量 (Page Views)
- ✅ 工作階段 (Sessions)
- ✅ 用戶數 (Users)
- ✅ 跳出率 (Bounce Rate)
- ✅ 工作階段持續時間

### 自定義追蹤
- ✅ 電影搜尋行為分析
- ✅ 熱門電影排行
- ✅ 用戶互動模式
- ✅ 反饋類型統計
- ✅ 外部連結點擊率

## 🛡️ 隱私和合規

### GDPR 合規性
- GA 只在生產環境載入
- 可透過環境變數控制啟用/停用
- 未收集個人識別資訊 (PII)
- 事件標籤僅包含必要的業務數據

### 建議改進
1. **Cookie 同意橫幅**: 考慮加入 Cookie 同意機制
2. **IP 匿名化**: 在 GA 設定中啟用 IP 匿名化
3. **數據保留期**: 設定適當的數據保留期限

## 🚀 部署注意事項

### Vercel 部署
```bash
# 在 Vercel Dashboard 設定環境變數
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 生產環境檢查清單
- [ ] GA 測量 ID 已正確設定
- [ ] 環境變數已部署到生產環境
- [ ] GA 即時報表顯示數據
- [ ] 自定義事件正常觸發
- [ ] 頁面追蹤正常運作

## 📞 問題排除

### 常見問題
1. **GA 沒有收到數據**: 檢查測量 ID 是否正確
2. **開發環境看不到 GA**: 正常，只在生產環境載入
3. **事件沒有追蹤**: 檢查 gtag 函數是否正確調用

### 除錯方法
```javascript
// 在瀏覽器 Console 檢查 gtag 是否載入
console.log(window.gtag);

// 手動觸發事件測試
window.gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test'
});
```

---

🎉 **設定完成！** 您的網站現在已經具備完整的 Google Analytics 追蹤功能。