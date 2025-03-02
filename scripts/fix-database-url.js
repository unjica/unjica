/**
 * This script helps fix the DATABASE_URL format issue.
 * Run it with: node scripts/fix-database-url.js
 */

// Get the current DATABASE_URL from environment
const currentUrl = process.env.TEST || '';

console.log('Current DATABASE_URL:', currentUrl.replace(/:[^:]*@/, ':****@'));

// Check if it's properly formatted
if (currentUrl.startsWith('postgresql://') || currentUrl.startsWith('postgres://')) {
  console.log('✅ Your DATABASE_URL is correctly formatted with the required protocol.');
} else {
  console.log('❌ Your DATABASE_URL is missing the required protocol.');
  
  // Try to fix it
  if (currentUrl.includes('@') && currentUrl.includes(':')) {
    const fixedUrl = `postgresql://${currentUrl}`;
    console.log('Suggested fix:', fixedUrl.replace(/:[^:]*@/, ':****@'));
    console.log('\nTo fix this issue, you need to update your environment variable:');
    console.log('\n1. For Vercel deployment:');
    console.log('   - Go to your Vercel project settings');
    console.log('   - Navigate to the "Environment Variables" section');
    console.log('   - Update the DATABASE_URL value to include the "postgresql://" prefix');
    
    console.log('\n2. For local development:');
    console.log('   - Update your .env.local file with the correct format');
    console.log('   - Make sure it starts with "postgresql://" or "postgres://"');
  } else {
    console.log('Unable to automatically fix the URL format. Please ensure your DATABASE_URL is in the format:');
    console.log('postgresql://username:password@hostname:port/database');
  }
}

// Check for other common issues
if (currentUrl.includes('supabase')) {
  if (!currentUrl.includes('pooler.supabase.com')) {
    console.log('\n⚠️ Note: For Supabase, you might need to use the connection pooler URL.');
    console.log('The connection pooler URL typically includes "pooler.supabase.com".');
  }
}

console.log('\nRemember to restart your application after updating the DATABASE_URL.'); 