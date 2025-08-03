// 測試 sitemap 生成
async function testSitemap() {
  console.log('🔍 測試 sitemap 生成...')
  
  const baseUrl = 'https://paruparu.vercel.app'
  const apiUrl = 'https://moviebonus-python-scrapers-777964931661.asia-east1.run.app'
  const fullUrl = `${apiUrl}/api/v1/supabase/movies?limit=10`
  
  try {
    console.log('📡 呼叫 API:', fullUrl)
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'MovieBonus-Sitemap-Generator/1.0',
        'Accept': 'application/json'
      }
    })
    
    console.log('📊 API 回應狀態:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('📄 API 回應結構:', {
        success: data.success,
        dataLength: data.data?.length || 0,
        hasData: !!data.data
      })
      
      const movies = data.data || []
      
      if (movies.length > 0) {
        console.log('🎬 前 3 部電影:')
        movies.slice(0, 3).forEach((movie, index) => {
          console.log(`  ${index + 1}. ${movie.title} (ID: ${movie.id})`)
          console.log(`     URL: ${baseUrl}/movie/${encodeURIComponent(movie.id)}`)
        })
        
        console.log(`✅ 總共找到 ${movies.length} 部電影`)
      } else {
        console.log('❌ 沒有找到電影資料')
      }
    } else {
      console.log('❌ API 呼叫失敗:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ 錯誤:', error.message)
  }
}

testSitemap()
