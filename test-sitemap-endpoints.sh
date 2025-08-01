#!/bin/bash

# 測試 sitemap 端點的可訪問性

echo "測試 MovieBonus Sitemap 端點..."
echo "==============================="

BASE_URL="https://paruparu.vercel.app"

# 定義要測試的端點
endpoints=(
  "/sitemap.xml"
  "/sitemap_index.xml"
  "/server-sitemap.xml"
  "/robots.txt"
)

# 測試每個端點
for endpoint in "${endpoints[@]}"; do
  echo -e "\n測試 $endpoint ..."
  
  # 使用 curl 檢查響應狀態
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
  
  if [ "$response" -eq 200 ]; then
    echo "✅ $endpoint - 成功 (HTTP $response)"
    
    # 獲取 Content-Type
    content_type=$(curl -s -I "$BASE_URL$endpoint" | grep -i "content-type" | awk '{print $2}')
    echo "   Content-Type: $content_type"
    
    # 顯示前幾行內容
    echo "   內容預覽:"
    curl -s "$BASE_URL$endpoint" | head -n 5 | sed 's/^/   /'
  else
    echo "❌ $endpoint - 失敗 (HTTP $response)"
  fi
done

echo -e "\n\n驗證 robots.txt 中的 Sitemap 引用..."
echo "======================================"
curl -s "$BASE_URL/robots.txt" | grep -i "sitemap:" | sed 's/^/   /'

echo -e "\n\n測試完成！"