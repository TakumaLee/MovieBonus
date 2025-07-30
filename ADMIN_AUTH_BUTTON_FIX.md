# Admin 登入/登出按鈕狀態管理修復

## 問題描述
Admin 頁面的登入/登出按鈕沒有根據登入狀態變化，始終顯示「登出」按鈕。

## 解決方案
修改了 `/src/app/admin/layout.tsx` 檔案，實現了以下功能：

### 1. 新增登入狀態管理
- 新增 `isAuthenticated` state 來追蹤用戶登入狀態
- 新增 `checkingAuth` state 來處理載入狀態

### 2. 實現登入狀態檢查
```typescript
useEffect(() => {
  const checkAuth = async () => {
    // 登入相關頁面不需要檢查
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
      setCheckingAuth(false);
      return;
    }

    try {
      const response = await adminApi.auth.verify();
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  checkAuth();
}, [pathname]);
```

### 3. 條件渲染登入/登出按鈕
根據 `isAuthenticated` 狀態顯示不同的按鈕：
- **已登入**：顯示「個人設定」和「登出」按鈕
- **未登入**：顯示「登入」按鈕

### 4. 更新登出處理
在 `handleLogout` 函數中更新狀態：
```typescript
// Update authentication state
setIsAuthenticated(false);
```

### 5. 改進的功能
- **側邊欄**：根據登入狀態顯示不同的按鈕
- **頂部標題列**：在桌面版顯示登入/登出按鈕
- **載入狀態**：檢查登入狀態時顯示載入動畫
- **特殊頁面處理**：登入、忘記密碼、重設密碼頁面不顯示 layout

## 預期行為
1. **未登入時**：顯示「登入」按鈕，點擊跳轉到登入頁面
2. **已登入時**：顯示「登出」按鈕和「個人設定」選項
3. **登入成功後**：自動更新為「登出」按鈕
4. **登出後**：自動更新為「登入」按鈕並跳轉到登入頁面

## 技術細節
- 使用 `adminApi.auth.verify()` 檢查登入狀態
- 使用 React hooks (`useState`, `useEffect`) 管理狀態
- 使用 Next.js 的 `router.refresh()` 確保頁面更新
- 條件渲染確保按鈕根據狀態正確顯示