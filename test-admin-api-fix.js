#!/usr/bin/env node

/**
 * Test script to verify admin API client configuration
 * Checks that the production URL is correctly configured
 */

const fs = require('fs');
const path = require('path');

console.log('Testing Admin API Client Configuration...\n');

// Read the api-client-admin.ts file
const filePath = path.join(__dirname, 'src/lib/api-client-admin.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Check if the production URL is hardcoded
const productionUrl = 'https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app';
const hasProductionUrl = fileContent.includes(productionUrl);

console.log('✓ Checking for production URL in api-client-admin.ts...');
if (hasProductionUrl) {
  console.log('✅ Production URL is correctly configured!');
  console.log(`   URL: ${productionUrl}`);
} else {
  console.log('❌ Production URL is NOT configured!');
  console.log('   The admin API will fail in production.');
}

// Check for environment-based switching
const hasEnvSwitch = fileContent.includes('process.env.NODE_ENV === \'production\'');
if (hasEnvSwitch) {
  console.log('✅ Environment-based URL switching is implemented!');
} else {
  console.log('⚠️  No environment-based URL switching found.');
}

// Display the constructor content
const constructorMatch = fileContent.match(/constructor\(\) {[\s\S]*?}/);
if (constructorMatch) {
  console.log('\nCurrent constructor implementation:');
  console.log('-----------------------------------');
  console.log(constructorMatch[0]);
  console.log('-----------------------------------');
}

console.log('\n📝 Summary:');
console.log('- The admin API client should use the production URL when NODE_ENV=production');
console.log('- In development, it should fall back to localhost:3000');
console.log('- This ensures the admin panel works correctly on the production site');

console.log('\n🚀 Next steps:');
console.log('1. Commit these changes');
console.log('2. Deploy to Vercel');
console.log('3. Optionally, add NEXT_PUBLIC_NODE_API_URL to Vercel environment variables');