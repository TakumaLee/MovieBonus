#!/bin/bash

echo "=== Testing Sitemap Accessibility ==="
echo

# Test 1: Basic connectivity
echo "1. Testing basic connectivity:"
curl -s -o /dev/null -w "HTTP Code: %{http_code}\nContent-Type: %{content_type}\nDownload Size: %{size_download} bytes\nResponse Time: %{time_total}s\n" https://paruparu.vercel.app/sitemap.xml
echo

# Test 2: Googlebot User-Agent
echo "2. Testing with Googlebot User-Agent:"
curl -s -H "User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)" -o /dev/null -w "HTTP Code: %{http_code}\nContent-Type: %{content_type}\n" https://paruparu.vercel.app/sitemap.xml
echo

# Test 3: XML Validation
echo "3. Validating XML format:"
curl -s https://paruparu.vercel.app/sitemap.xml > /tmp/sitemap_test.xml
if xmllint --noout /tmp/sitemap_test.xml 2>&1; then
    echo "✓ XML is valid"
else
    echo "✗ XML validation failed"
fi
echo

# Test 4: Check for BOM
echo "4. Checking for BOM (Byte Order Mark):"
if head -c 3 /tmp/sitemap_test.xml | grep -q $'\xef\xbb\xbf'; then
    echo "✗ BOM detected (this could cause issues)"
else
    echo "✓ No BOM detected"
fi
echo

# Test 5: Compression check
echo "5. Checking if response is compressed:"
curl -s -H "Accept-Encoding: gzip, deflate" -H "User-Agent: Googlebot/2.1" https://paruparu.vercel.app/sitemap.xml -o /tmp/sitemap_compressed.gz -w "Content-Encoding: %{content_encoding}\n"
echo

# Test 6: Robots.txt accessibility
echo "6. Testing robots.txt:"
curl -s -o /dev/null -w "HTTP Code: %{http_code}\n" https://paruparu.vercel.app/robots.txt
echo

# Test 7: Check sitemap reference in robots.txt
echo "7. Checking sitemap reference in robots.txt:"
curl -s https://paruparu.vercel.app/robots.txt | grep -i sitemap
echo

echo "=== Test Complete ==="