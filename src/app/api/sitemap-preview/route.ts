import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 預覽 sitemap 內容
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:9002' 
      : 'https://paruparu.vercel.app'
    
    const response = await fetch(`${baseUrl}/sitemap.xml`)
    const xml = await response.text()
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sitemap' }, { status: 500 })
  }
}