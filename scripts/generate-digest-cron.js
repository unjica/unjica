#!/usr/bin/env node

/**
 * Cron job script to trigger the art digest generation.
 * 
 * To use this script:
 * 1. Make it executable: chmod +x scripts/generate-digest-cron.js
 * 2. Set up a cron job to run it daily at midnight.
 * 
 * Example crontab entry:
 * 0 0 * * * /path/to/your/project/scripts/generate-digest-cron.js
 * 
 * For cloud deployment, set up a cron service that calls:
 * - Vercel Cron Jobs (preferred)
 * - GitHub Actions with a schedule
 * - External cron service that hits your API endpoint
 */

const https = require('https');
const http = require('http');

// Get URL from environment or default to localhost
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_SECRET = process.env.CRON_SECRET || '';

// Determine if using http or https based on the URL
const request = BASE_URL.startsWith('https') ? https.request : http.request;

// Parse the URL
const url = new URL('/api/scheduler', BASE_URL);

// Add secret if provided
if (API_SECRET) {
  url.searchParams.append('secret', API_SECRET);
}

console.log(`[${new Date().toISOString()}] Triggering art digest generation...`);

const req = request(
  {
    method: 'POST',
    hostname: url.hostname,
    port: url.port,
    path: `${url.pathname}${url.search}`,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(data);
          console.log(`[${new Date().toISOString()}] Success:`, result.message);
        } catch (e) {
          console.log(`[${new Date().toISOString()}] Success, but invalid JSON response`);
        }
      } else {
        console.error(`[${new Date().toISOString()}] Error: Status ${res.statusCode}`);
        console.error(data);
      }
    });
  }
);

req.on('error', (error) => {
  console.error(`[${new Date().toISOString()}] Request failed:`, error.message);
});

req.end(); 