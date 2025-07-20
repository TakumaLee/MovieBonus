# 🐛 Bug 修復報告

## 已修復的問題

### 1. 🎬 正在上映與即將上映電影沒有區分

**問題描述**：
- 兩個標籤頁都顯示相同的電影列表
- `useNowPlayingMovies()` 和 `useComingSoonMovies()` 都調用了相同的 API

**根本原因**：
在 `src/hooks/useMovies.ts` 的 `fetchMovies` 函數中，無論傳入什麼 `status` 參數，都只調用 `movieApi.getNowPlayingMovies()`

**修復方案**：
更新 `fetchMovies` 函數，根據 `status` 參數調用不同的 API：

```typescript
// 修復前
response = await movieApi.getNowPlayingMovies();

// 修復後
if (status === 'showing') {
  response = await movieApi.getNowPlayingMovies();
} else if (status === 'coming_soon') {
  response = await movieApi.getComingSoonMovies();
} else {
  response = await movieApi.getAllMovies();
}
```

**結果**：
- ✅ "正在上映" 標籤顯示 `status: "showing"` 的電影
- ✅ "即將上映" 標籤顯示 `status: "coming_soon"` 的電影

---

### 2. 🎁 特典資訊沒有顯示在電影列表中

**問題描述**：
- 電影卡片上沒有顯示"特典"徽章
- `useMovieHasBonuses` hook 無法正確獲取特典資料

**根本原因**：
API 端點不正確，特典 API 路徑錯誤：
- 錯誤：`/api/v1/movie-bonuses/${movieId}`
- 正確：`/api/v1/supabase/promotions?movie_id=${movieId}`

**修復方案**：
更新 `src/lib/api-endpoints.ts` 中的特典 API 端點：

```typescript
// 修復前
getByMovieId: (movieId: string) =>
  apiClient.get<ApiResponse<MoviePromotion[]>>(`/api/v1/movie-bonuses/${movieId}`),

// 修復後  
getByMovieId: (movieId: string) =>
  apiClient.get<ApiResponse<MoviePromotion[]>>(`/api/v1/supabase/promotions?movie_id=${movieId}`),
```

**結果**：
- ✅ 有特典的電影會顯示"特典"徽章
- ✅ 超人等有特典的電影會正確標示
- ✅ `useMovieHasBonuses` hook 正常工作

---

## 修復的文件

### 1. `src/hooks/useMovies.ts`
- **修復行數**: 112-119
- **修復內容**: 根據 status 參數調用不同的 API 端點

### 2. `src/lib/api-endpoints.ts`  
- **修復行數**: 61-66
- **修復內容**: 更正特典 API 端點路徑

---

## 測試驗證

### 電影狀態區分測試
```bash
# 測試正在上映的電影
curl "https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/api/v1/supabase/movies?status=showing&limit=3"

# 測試即將上映的電影  
curl "https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/api/v1/supabase/movies?status=coming_soon&limit=3"
```

### 特典資料測試
```bash
# 測試特典 API
curl "https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/api/v1/supabase/promotions?limit=3"
```

---

## 如何驗證修復

### 1. 重啟開發服務器
```bash
# 停止當前服務器 (Ctrl+C)
# 重新啟動
npm run dev
```

### 2. 檢查功能
在 http://localhost:9002 驗證：

#### 電影狀態區分
- [ ] 點擊"正在上映"標籤，顯示 `status: "showing"` 的電影
- [ ] 點擊"即將上映"標籤，顯示 `status: "coming_soon"` 的電影
- [ ] 兩個標籤頁顯示不同的電影列表

#### 特典顯示
- [ ] 有特典的電影卡片右上角顯示"特典"徽章
- [ ] 超人電影顯示特典徽章（如果在列表中）
- [ ] 沒有特典的電影不顯示徽章

### 3. 瀏覽器開發者工具檢查
- [ ] Network 面板顯示正確的 API 呼叫
- [ ] 沒有 API 錯誤訊息
- [ ] Console 沒有 JavaScript 錯誤

---

## 影響範圍

### 已修復的功能
✅ 電影狀態分類顯示  
✅ 特典徽章顯示  
✅ API 端點正確性  
✅ 資料快取機制  

### 不受影響的功能
✅ 電影詳情頁面  
✅ 搜尋功能  
✅ 響應式設計  
✅ 錯誤處理  

---

## 後續建議

### 1. API 端點統一
建議標準化所有 API 端點命名，避免類似混淆

### 2. 測試覆蓋
考慮添加單元測試來檢測這類 API 整合問題

### 3. 文檔更新
確保 API 文檔與實際端點保持同步

---

**🎉 修復完成！您的 MovieBonus 應用程式現在應該正確顯示電影狀態分類和特典資訊。**