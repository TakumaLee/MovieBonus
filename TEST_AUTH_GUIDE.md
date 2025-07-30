# 測試認證功能使用指南

## 概述
為了方便開發和測試，前端的 Admin API Client 已經整合了測試認證功能。當後端啟用測試認證模式時，前端會自動處理認證流程。

## 功能特點
1. **自動重試機制**：當收到 401 錯誤時，自動設置測試 cookie 並重試請求
2. **環境偵測**：在開發環境自動啟用，生產環境可透過環境變數控制
3. **無縫整合**：不需要修改現有的 API 呼叫程式碼

## 測試認證資訊
- **Cookie 名稱**: `test-admin-token`
- **測試 Token**: `development-test-token-2025`
- **後端驗證**: 後端會檢查此 cookie，如果值正確就允許訪問 admin API

## 使用方式

### 1. 開發環境（自動啟用）
在開發環境中，測試認證會自動啟用。當您訪問需要認證的頁面時：
1. 第一次請求可能會收到 401 錯誤
2. 系統會自動設置測試 cookie
3. 自動重試請求，應該會成功

### 2. 生產環境（需要明確啟用）
在生產環境，您需要設置環境變數來啟用測試認證：
```bash
NEXT_PUBLIC_ENABLE_TEST_AUTH=true
```

### 3. 手動初始化（可選）
您也可以在應用程式啟動時手動初始化測試認證：
```typescript
import { adminApiClient } from '@/lib/api-client-admin';

// 在應用程式初始化時
adminApiClient.initializeTestAuth();
```

### 4. 檢查測試認證狀態
```typescript
import { adminApiClient } from '@/lib/api-client-admin';

if (adminApiClient.isTestAuthEnabled()) {
  console.log('測試認證已啟用');
}
```

## 測試工具
使用 `test-admin-auth.html` 來測試和驗證測試認證功能：
1. 在瀏覽器開啟 `test-admin-auth.html`
2. 使用各個按鈕測試不同的功能
3. 觀察 API 回應和 Cookie 狀態

## 注意事項
1. **安全性**：測試認證僅供開發和測試使用，不應在真正的生產環境啟用
2. **Cookie 設定**：Cookie 使用 `SameSite=Lax` 設定，確保跨站請求的安全性
3. **自動重試**：只會重試一次，避免無限循環

## 故障排除

### 問題：頁面一直重導向到登入頁
**解決方案**：
1. 檢查是否正確設置了測試 cookie
2. 確認後端是否啟用了測試認證模式
3. 使用開發者工具檢查網路請求和 cookie

### 問題：API 請求仍然返回 401
**解決方案**：
1. 清除瀏覽器 cookie 並重新整理頁面
2. 檢查環境變數設定
3. 確認後端服務正在運行

### 問題：在生產環境無法使用測試認證
**解決方案**：
1. 確認 `NEXT_PUBLIC_ENABLE_TEST_AUTH=true` 已設置
2. 重新建構和部署應用程式
3. 檢查瀏覽器控制台的錯誤訊息