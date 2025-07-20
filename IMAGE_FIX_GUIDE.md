# 🖼️ Next.js 圖片配置修復指南

## 🔧 問題描述

當前錯誤：
```
Invalid src prop (https://www.vscinemas.com.tw/upload/film/...) on `next/image`, 
hostname "www.vscinemas.com.tw" is not configured under images in your `next.config.js`
```

## ✅ 解決方案

### 1. 已更新的配置
我已經更新了 `next.config.ts`，添加了威秀影城的圖片域名：

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'placehold.co',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'www.vscinemas.com.tw',  // 威秀影城主域名
      port: '',
      pathname: '/upload/film/**',
    },
    {
      protocol: 'https',
      hostname: 'vscinemas.com.tw',       // 威秀影城備用域名
      port: '',
      pathname: '/upload/**',
    },
  ],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 2. 重啟開發服務器

**重要**: Next.js 配置更改需要重啟服務器才能生效。

```bash
# 1. 停止當前的開發服務器
# 按 Ctrl+C

# 2. 重新啟動
npm run dev
```

### 3. 驗證修復

重啟後，電影海報圖片應該正常顯示，來自：
- `https://www.vscinemas.com.tw/upload/film/...`
- 以及其他配置的域名

## 🎯 配置說明

### 已支援的圖片來源
- ✅ `placehold.co` - 佔位符圖片
- ✅ `www.vscinemas.com.tw` - 威秀影城電影海報
- ✅ `vscinemas.com.tw` - 威秀影城備用域名

### 圖片優化功能
- 🚀 WebP 和 AVIF 格式支援
- 📱 響應式圖片尺寸
- 🔄 自動圖片優化
- ⚡ 懶載入

## 🐛 如果問題持續

### 檢查步驟
1. **確認重啟**: 確保完全重啟了開發服務器
2. **清除快取**: 
   ```bash
   rm -rf .next
   npm run dev
   ```
3. **檢查配置**: 確認 `next.config.ts` 更改已保存

### 添加新域名
如果需要支援其他圖片來源，在 `remotePatterns` 數組中添加：

```typescript
{
  protocol: 'https',
  hostname: 'new-image-domain.com',
  port: '',
  pathname: '/**',
}
```

## 📝 最佳實踐

### 1. 安全性
- 只添加信任的圖片域名
- 使用具體的路徑模式而非 `/**`（如果可能）

### 2. 效能
- 利用 Next.js 圖片優化
- 設定適當的圖片尺寸
- 使用現代圖片格式

### 3. 維護
- 定期檢查圖片來源
- 更新已過期的域名
- 監控圖片載入效能

## ✅ 完成！

配置更新後，您的 MovieBonus 應用程式應該能正常顯示所有電影海報圖片！

記得重啟開發服務器：`npm run dev` 🎉