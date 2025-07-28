// 測試 Admin 登入的診斷腳本
const https = require('https');
const http = require('http');

// 測試設定
const API_URL = 'http://localhost:9002';
const TEST_EMAIL = 'admin@example.com';
const TEST_PASSWORD = 'securepassword123';

// 顏色輸出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Step 1: 取得 CSRF Token
async function getCSRFToken() {
  return new Promise((resolve, reject) => {
    log('\n=== Step 1: 取得 CSRF Token ===', 'blue');
    
    const options = {
      hostname: 'localhost',
      port: 9002,
      path: '/api/admin/login',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      const cookies = res.headers['set-cookie'] || [];
      
      log(`狀態碼: ${res.statusCode}`, res.statusCode === 200 ? 'green' : 'red');
      log(`Cookies: ${cookies.length > 0 ? 'Found' : 'Not found'}`, cookies.length > 0 ? 'green' : 'red');
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          log(`回應: ${JSON.stringify(result, null, 2)}`, 'yellow');
          
          if (result.csrfToken && cookies.length > 0) {
            const sessionCookie = cookies.find(c => c.includes('admin-session-id'));
            resolve({ csrfToken: result.csrfToken, cookie: sessionCookie });
          } else {
            reject(new Error('無法取得 CSRF token 或 session cookie'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      log(`錯誤: ${error.message}`, 'red');
      reject(error);
    });

    req.end();
  });
}

// Step 2: 嘗試登入
async function attemptLogin(csrfToken, sessionCookie) {
  return new Promise((resolve, reject) => {
    log('\n=== Step 2: 嘗試登入 ===', 'blue');
    
    const postData = JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      csrfToken: csrfToken
    });

    const options = {
      hostname: 'localhost',
      port: 9002,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': sessionCookie,
        'Accept': 'application/json'
      }
    };

    log(`請求資料: ${postData}`, 'yellow');
    log(`Cookie: ${sessionCookie}`, 'yellow');

    const req = http.request(options, (res) => {
      let data = '';
      
      log(`狀態碼: ${res.statusCode}`, res.statusCode === 200 ? 'green' : 'red');
      log(`回應標頭:`, 'yellow');
      console.log(res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          log(`回應內容: ${JSON.stringify(result, null, 2)}`, res.statusCode === 200 ? 'green' : 'red');
          
          if (res.statusCode === 200) {
            resolve(result);
          } else {
            reject(new Error(`登入失敗: ${result.error || 'Unknown error'}`));
          }
        } catch (error) {
          log(`解析錯誤: ${data}`, 'red');
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      log(`請求錯誤: ${error.message}`, 'red');
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Step 3: 檢查環境變數
async function checkEnvironment() {
  log('\n=== Step 3: 檢查環境變數 ===', 'blue');
  
  // 檢查 Next.js 是否正在運行
  try {
    const testReq = http.get('http://localhost:9002/', (res) => {
      log(`Next.js 服務: 運行中 (狀態碼: ${res.statusCode})`, 'green');
    });
    testReq.on('error', () => {
      log('Next.js 服務: 未運行！請先執行 npm run dev', 'red');
    });
  } catch (error) {
    log('無法連接到 Next.js 服務', 'red');
  }
}

// 執行測試
async function runTest() {
  log('=== MovieBonus Admin 登入診斷工具 ===', 'blue');
  log(`測試時間: ${new Date().toLocaleString('zh-TW')}`, 'yellow');
  log(`測試帳號: ${TEST_EMAIL}`, 'yellow');
  
  try {
    // 檢查環境
    await checkEnvironment();
    
    // 等待一下確保服務已啟動
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 取得 CSRF Token
    const { csrfToken, cookie } = await getCSRFToken();
    
    // 嘗試登入
    const loginResult = await attemptLogin(csrfToken, cookie);
    
    log('\n=== 測試成功！ ===', 'green');
    log('登入成功，用戶資訊:', 'green');
    console.log(loginResult.user);
    
  } catch (error) {
    log('\n=== 測試失敗！ ===', 'red');
    log(`錯誤訊息: ${error.message}`, 'red');
    
    log('\n=== 建議檢查項目 ===', 'yellow');
    log('1. 確認 Next.js 開發伺服器正在運行 (npm run dev)', 'yellow');
    log('2. 確認環境變數正確設定', 'yellow');
    log('3. 確認 Supabase 連線正常', 'yellow');
    log('4. 確認 admin_users 表中有測試帳號', 'yellow');
    log('5. 檢查瀏覽器開發者工具的 Console 和 Network 標籤', 'yellow');
  }
}

// 顯示使用說明
log('\n使用方式:', 'yellow');
log('1. 確保 Next.js 開發伺服器正在運行: npm run dev', 'yellow');
log('2. 執行此腳本: node test-admin-login-debug.js', 'yellow');
log('3. 如需測試其他帳號，請修改腳本中的 TEST_EMAIL 和 TEST_PASSWORD', 'yellow');

// 執行測試
runTest();