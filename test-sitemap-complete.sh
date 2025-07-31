#!/bin/bash

echo "==================================="
echo "Complete Sitemap Diagnostics"
echo "==================================="
echo ""

SITE_URL="https://paruparu.vercel.app"

# Function to test URL
test_url() {
    local url=$1
    local description=$2
    
    echo "Testing: $description"
    echo "URL: $url"
    
    # Test with curl
    response=$(curl -s -I -H "User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)" "$url")
    status_code=$(echo "$response" | grep "HTTP" | tail -1 | awk '{print $2}')
    content_type=$(echo "$response" | grep -i "content-type:" | cut -d' ' -f2- | tr -d '\r')
    x_robots=$(echo "$response" | grep -i "x-robots-tag:" | cut -d' ' -f2- | tr -d '\r')
    
    echo "Status: $status_code"
    echo "Content-Type: $content_type"
    
    if [ ! -z "$x_robots" ]; then
        echo "⚠️  X-Robots-Tag: $x_robots"
        if [[ "$x_robots" == *"noindex"* ]]; then
            echo "❌ ERROR: noindex tag prevents Google from indexing this file!"
        fi
    else
        echo "✅ No X-Robots-Tag (good)"
    fi
    
    # Download and validate XML if applicable
    if [[ "$url" == *.xml ]]; then
        echo -n "XML Validation: "
        if curl -s "$url" | xmllint --noout - 2>/dev/null; then
            echo "✅ Valid XML"
        else
            echo "❌ Invalid XML"
            curl -s "$url" | xmllint --noout - 2>&1 | head -3
        fi
    fi
    
    echo "-----------------------------------"
    echo ""
}

# Test all sitemap variants
test_url "$SITE_URL/sitemap.xml" "Main Sitemap"
test_url "$SITE_URL/sitemap-minimal.xml" "Minimal Sitemap"
test_url "$SITE_URL/sitemap_index.xml" "Sitemap Index"
test_url "$SITE_URL/sitemap.txt" "Text Sitemap"
test_url "$SITE_URL/robots.txt" "Robots.txt"

# Test API endpoint
echo "Testing Diagnostic API..."
echo "URL: $SITE_URL/api/sitemap-test"
curl -s "$SITE_URL/api/sitemap-test" | python3 -m json.tool 2>/dev/null || echo "Failed to fetch or parse JSON"
echo ""

echo "==================================="
echo "Summary and Recommendations"
echo "==================================="
echo ""
echo "1. Main Issue Fixed: Removed 'X-Robots-Tag: noindex' from vercel.json"
echo "2. Created multiple sitemap formats for testing"
echo "3. Updated robots.txt to reference all sitemaps"
echo ""
echo "Next Steps:"
echo "1. Deploy these changes to Vercel"
echo "2. Wait 10-15 minutes for deployment"
echo "3. Test using this script again"
echo "4. Submit sitemaps to Google Search Console:"
echo "   - $SITE_URL/sitemap.xml (main)"
echo "   - $SITE_URL/sitemap-minimal.xml (for testing)"
echo "   - $SITE_URL/sitemap_index.xml (alternative format)"
echo "5. Use Google's URL Inspection tool to test immediately"
echo ""
echo "The 'noindex' header was the main problem preventing Google from reading your sitemap!"