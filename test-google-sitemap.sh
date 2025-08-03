#!/bin/bash

echo "🔍 Google Sitemap 診斷工具"
echo "=========================="

BASE_URL="https://paruparu.vercel.app"

echo ""
echo "1. 測試 sitemap.xml 訪問性"
echo "----------------------------"
curl -I "$BASE_URL/sitemap.xml" 2>/dev/null | head -1
echo ""

echo "2. 測試 Googlebot User-Agent"
echo "----------------------------"
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" -I "$BASE_URL/sitemap.xml" 2>/dev/null | head -1
echo ""

echo "3. 檢查 Content-Type"
echo "-------------------"
curl -I "$BASE_URL/sitemap.xml" 2>/dev/null | grep -i "content-type"
echo ""

echo "4. 檢查 X-Robots-Tag"
echo "-------------------"
curl -I "$BASE_URL/sitemap.xml" 2>/dev/null | grep -i "x-robots-tag"
echo ""

echo "5. 測試 sitemap 內容"
echo "-------------------"
curl -s "$BASE_URL/sitemap.xml" | head -10
echo ""

echo "6. 驗證 XML 格式"
echo "---------------"
if command -v xmllint &> /dev/null; then
    curl -s "$BASE_URL/sitemap.xml" | xmllint --format - > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ XML 格式正確"
    else
        echo "❌ XML 格式錯誤"
    fi
else
    echo "⚠️  xmllint 未安裝，無法驗證 XML 格式"
fi
echo ""

echo "7. 測試簡化版 sitemap"
echo "-------------------"
curl -I "$BASE_URL/sitemap-simple.xml" 2>/dev/null | head -1
echo ""

echo "8. 檢查 robots.txt"
echo "-----------------"
curl -s "$BASE_URL/robots.txt" | grep -i sitemap
echo ""

echo "🎯 建議："
echo "1. 如果所有測試都通過，問題可能是 Google 處理延遲"
echo "2. 嘗試在 Google Search Console 中提交 sitemap-simple.xml"
echo "3. 使用 URL 檢查工具檢查首頁"
echo "4. 等待 24-48 小時後重新檢查"
