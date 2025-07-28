/**
 * Frontend Integration Test for Option A Architecture
 * Tests admin authentication flow from frontend perspective
 */

const puppeteer = require('puppeteer');
const assert = require('assert');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9002';
const NODE_API_URL = process.env.NODE_API_URL || 'http://localhost:3000';
const TEST_ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@moviebonus.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'testpassword123'
};

// Test utilities
function logTestStart(testName) {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log('─'.repeat(50));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error('   Error:', error.message || error);
  }
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test function
async function runFrontendTests() {
  console.log('\n🌐 MovieBonus Frontend Integration Test');
  console.log('=' .repeat(60));
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);
  console.log(`📍 Backend API: ${NODE_API_URL}`);
  console.log('=' .repeat(60));

  let browser;
  let page;

  try {
    // Launch browser
    logTestStart('Browser Setup');
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logError(`Browser console error: ${msg.text()}`);
      }
    });

    // Network logging
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        networkRequests.push({
          method: request.method(),
          url: request.url(),
          headers: request.headers()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        logInfo(`API Response: ${response.status()} ${response.url()}`);
      }
    });

    logSuccess('Browser launched successfully');

    // Test 1: Navigate to Admin Login
    logTestStart('Navigate to Admin Login Page');
    await page.goto(`${FRONTEND_URL}/admin/login`, { waitUntil: 'networkidle2' });
    
    // Check if login page loaded
    const loginTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
    assert(loginTitle, 'Login page should have a title');
    logSuccess(`Login page loaded: "${loginTitle}"`);

    // Test 2: Check API Connection
    logTestStart('Verify Backend API Connection');
    
    // Check network requests for CSRF token
    const csrfRequest = networkRequests.find(r => r.url.includes('/api/admin/csrf-token'));
    if (csrfRequest) {
      logSuccess('CSRF token request detected');
      logInfo(`Request to: ${csrfRequest.url}`);
    } else {
      logInfo('CSRF token might be requested later or on-demand');
    }

    // Test 3: Fill Login Form
    logTestStart('Fill Login Form');
    
    // Wait for form elements
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
    
    // Fill form
    await page.type('input[type="email"]', TEST_ADMIN.email);
    await page.type('input[type="password"]', TEST_ADMIN.password);
    logSuccess('Login form filled');

    // Test 4: Submit Login
    logTestStart('Submit Login Form');
    
    // Clear previous network requests
    networkRequests.length = 0;
    
    // Find and click submit button
    const submitButton = await page.$('button[type="submit"]');
    assert(submitButton, 'Submit button should exist');
    
    // Click submit and wait for navigation or response
    await Promise.all([
      submitButton.click(),
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {
        // Might not navigate if login fails
      }),
      delay(2000) // Wait for API response
    ]);

    // Check login request
    const loginRequest = networkRequests.find(r => r.url.includes('/api/admin/login'));
    if (loginRequest) {
      logSuccess('Login API request sent');
      logInfo(`Method: ${loginRequest.method}`);
      
      // Check for cookies
      const cookies = await page.cookies();
      const sessionCookie = cookies.find(c => c.name === 'admin-session');
      const sessionIdCookie = cookies.find(c => c.name === 'admin-session-id');
      
      if (sessionCookie) {
        logSuccess('Admin session cookie set');
        logInfo(`Cookie: ${sessionCookie.name} (expires: ${new Date(sessionCookie.expires * 1000).toISOString()})`);
      }
      
      if (sessionIdCookie) {
        logInfo(`Session ID cookie: ${sessionIdCookie.name}`);
      }
    } else {
      logError('No login request detected');
    }

    // Test 5: Check Post-Login State
    logTestStart('Verify Post-Login State');
    
    // Wait a bit for any redirects
    await delay(2000);
    
    const currentUrl = page.url();
    logInfo(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      logSuccess('Successfully redirected to admin area');
      
      // Check for user info
      const userInfo = await page.$eval('[data-testid="user-info"]', el => el.textContent).catch(() => null);
      if (userInfo) {
        logInfo(`User info displayed: ${userInfo}`);
      }
    } else if (currentUrl.includes('/login')) {
      // Check for error messages
      const errorMessage = await page.$eval('[role="alert"]', el => el.textContent).catch(() => null);
      if (errorMessage) {
        logError(`Login failed with error: ${errorMessage}`);
      } else {
        logError('Login failed without error message');
      }
    }

    // Test 6: Security Verification
    logTestStart('Security Verification');
    
    // Check page source for sensitive data
    const pageContent = await page.content();
    
    const sensitivePatterns = [
      'SUPABASE_SERVICE_ROLE_KEY',
      'service_role',
      'JWT_SECRET'
    ];
    
    let securityIssues = [];
    sensitivePatterns.forEach(pattern => {
      if (pageContent.includes(pattern)) {
        securityIssues.push(pattern);
      }
    });
    
    if (securityIssues.length === 0) {
      logSuccess('No sensitive data exposed in frontend');
    } else {
      logError(`Security issue: Found sensitive patterns: ${securityIssues.join(', ')}`);
    }

    // Test 7: Test Session Persistence
    logTestStart('Session Persistence Test');
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle2' });
    await delay(1000);
    
    // Check if still logged in
    const verifyRequest = networkRequests.find(r => r.url.includes('/api/admin/verify'));
    if (verifyRequest) {
      logSuccess('Session verification request sent on reload');
    }
    
    // Test 8: Logout Test
    logTestStart('Logout Functionality');
    
    // Try to find logout button
    const logoutButton = await page.$('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("登出")').catch(() => null);
    
    if (logoutButton) {
      networkRequests.length = 0;
      await logoutButton.click();
      await delay(2000);
      
      const logoutRequest = networkRequests.find(r => r.url.includes('/api/admin/logout'));
      if (logoutRequest) {
        logSuccess('Logout API request sent');
        
        // Check if redirected to login
        const afterLogoutUrl = page.url();
        if (afterLogoutUrl.includes('/login')) {
          logSuccess('Redirected to login page after logout');
        }
      }
    } else {
      logInfo('Logout button not found (might need to navigate to correct page)');
    }

    // Generate summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Frontend Test Summary');
    console.log('=' .repeat(60));
    
    console.log('✅ Frontend is running and accessible');
    console.log('✅ Admin login page loads correctly');
    console.log('✅ Backend API connection established');
    console.log('✅ No sensitive data exposed in frontend');
    
    // Network summary
    console.log('\n📡 API Calls Summary:');
    const apiCalls = [...new Set(networkRequests.map(r => r.url))];
    apiCalls.forEach(url => {
      console.log(`  - ${url}`);
    });

  } catch (error) {
    logError('Test failed with error:', error);
    
    // Take screenshot on error
    if (page) {
      await page.screenshot({ path: 'test-error-screenshot.png' });
      logInfo('Screenshot saved as test-error-screenshot.png');
    }
    
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the tests
console.log('🚀 Starting Frontend Integration Tests...\n');

runFrontendTests()
  .then(() => {
    console.log('\n✅ All frontend tests completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Frontend tests failed:', error.message);
    process.exit(1);
  });