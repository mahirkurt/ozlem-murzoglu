#!/usr/bin/env node
/**
 * Google Ads OAuth2 Setup - Refresh token alır ve kaydeder.
 * Kullanım: node scripts/google-ads/setup-auth.mjs
 */

import http from 'node:http';
import { URL } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');

// Read OAuth2 credentials
const credFile = resolve(PROJECT_ROOT, 'client_secret_google_ads.apps.googleusercontent.com.json');
if (!existsSync(credFile)) {
  console.error('OAuth2 credentials file not found:', credFile);
  process.exit(1);
}

const creds = JSON.parse(readFileSync(credFile, 'utf-8')).installed;
const CLIENT_ID = creds.client_id;
const CLIENT_SECRET = creds.client_secret;
const REDIRECT_PORT = 3847;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;
const SCOPES = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/business.manage',
].join(' ');

const TOKEN_FILE = resolve(__dirname, 'google-ads-token.json');

// Build authorization URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('\n=== Google Ads OAuth2 Setup ===\n');
console.log('Tarayicida giris sayfasi acilacak...\n');

// Start local server to capture the callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);

  if (url.pathname === '/' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body><h2>Yetkilendirme basarili! Bu sekmeyi kapatabilirsiniz.</h2></body></html>');

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        console.error('\nToken alma hatasi:', tokens.error_description || tokens.error);
        process.exit(1);
      }

      // Save tokens
      const tokenData = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: Date.now() + tokens.expires_in * 1000,
      };

      writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
      console.log('\nRefresh token kaydedildi:', TOKEN_FILE);
      console.log('Artik Google Ads CLI kullanabilirsiniz:');
      console.log('  node scripts/google-ads/ads-manager.mjs --help\n');
    } catch (err) {
      console.error('\nHata:', err.message);
    }

    server.close();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body><h2>Yetkilendirme bekleniyor...</h2></body></html>');
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Callback server: http://localhost:${REDIRECT_PORT}`);
  console.log('\nTarayicida su linki acin:\n');
  console.log(authUrl.toString());
  console.log('');

  // Try to open browser automatically
  const openCmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${openCmd} "${authUrl.toString()}"`, (err) => {
    if (err) {
      console.log('(Tarayici otomatik acilamadi - linki manuel olarak acin)');
    }
  });
});

// Timeout after 5 minutes
setTimeout(() => {
  console.error('\nZaman asimi - 5 dakika icinde giris yapilmadi.');
  server.close();
  process.exit(1);
}, 5 * 60 * 1000);
