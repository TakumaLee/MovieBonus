import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    const robotsPath = path.join(publicDir, 'robots.txt');
    
    // Check if files exist
    const sitemapExists = fs.existsSync(sitemapPath);
    const robotsExists = fs.existsSync(robotsPath);
    
    // Read file contents if they exist
    let sitemapContent = null;
    let robotsContent = null;
    
    if (sitemapExists) {
      sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    }
    
    if (robotsExists) {
      robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    }
    
    // Check for various sitemap files
    const sitemapFiles = fs.readdirSync(publicDir)
      .filter(file => file.includes('sitemap'))
      .map(file => ({
        name: file,
        path: `/public/${file}`,
        size: fs.statSync(path.join(publicDir, file)).size
      }));
    
    // Test URL access
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paruparu.vercel.app';
    const testUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-minimal.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/sitemap.txt`,
      `${baseUrl}/robots.txt`
    ];
    
    const urlTests = await Promise.all(
      testUrls.map(async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
            }
          });
          
          return {
            url,
            status: response.status,
            contentType: response.headers.get('content-type'),
            cacheControl: response.headers.get('cache-control'),
            xRobotsTag: response.headers.get('x-robots-tag'),
            ok: response.ok
          };
        } catch (error) {
          return {
            url,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        siteUrl: baseUrl
      },
      fileSystem: {
        sitemapExists,
        robotsExists,
        sitemapFiles,
        sitemapFirstLine: sitemapContent ? sitemapContent.split('\n')[0] : null,
        robotsFirstLine: robotsContent ? robotsContent.split('\n')[0] : null
      },
      urlTests,
      recommendations: [
        sitemapExists ? '✅ Sitemap file exists' : '❌ Sitemap file not found',
        robotsExists ? '✅ Robots.txt file exists' : '❌ Robots.txt file not found',
        urlTests.some(test => test.xRobotsTag === 'noindex') 
          ? '❌ X-Robots-Tag: noindex header detected - this prevents indexing!' 
          : '✅ No blocking X-Robots-Tag headers',
        sitemapContent?.includes('<?xml') 
          ? '✅ Valid XML declaration found' 
          : '❌ No XML declaration found',
        robotsContent?.includes('Sitemap:') 
          ? '✅ Robots.txt includes sitemap reference' 
          : '❌ Robots.txt missing sitemap reference'
      ]
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to run sitemap diagnostics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}