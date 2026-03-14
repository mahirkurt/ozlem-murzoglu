#!/usr/bin/env node
/**
 * Marketing Tools OAuth2 Setup — GA4, GSC, GTM (edit+publish), Ads, GBP
 * Kullanım: node scripts/google-ads/setup-marketing-auth.mjs
 */

import http from 'node:http';
import { URL } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');

const credFile = resolve(PROJECT_ROOT, 'client_secret_google_ads.apps.googleusercontent.com.json');
if (!existsSync(credFile)) {
  console.error('OAuth2 credentials file not found:', credFile);
  process.exit(1);
}

const creds = JSON.parse(readFileSync(credFile, 'utf-8')).installed;
const CLIENT_ID = creds.client_id;
const CLIENT_SECRET = creds.client_secret;
const REDIRECT_PORT = 3848;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'https://www.googleapis.com/auth/tagmanager.publish',
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/business.manage',
].join(' ');

const TOKEN_FILE = resolve(__dirname, 'marketing-token.json');

const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('\n=== Marketing Tools OAuth2 Setup ===\n');
console.log('Scopes: analytics, search console, tag manager (edit+publish), ads, business profile\n');
console.log('Tarayicida giris sayfasi acilacak...\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);

  if (url.pathname === '/' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body><h2>Marketing yetkilendirme basarili! Bu sekmeyi kapatabilirsiniz.</h2></body></html>');

    try {
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

      const tokenData = {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        scope: tokens.scope,
        created_at: new Date().toISOString(),
      };

      writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
      console.log('\nToken kaydedildi:', TOKEN_FILE);
      console.log('Scope:', tokens.scope);
      console.log('\nKullanim: Bu token ile GTM tag/trigger olusturabilirsiniz.');

    } catch (err) {
      console.error('\nHata:', err.message);
    }

    server.close();
    process.exit(0);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Waiting for OAuth callback...');
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Callback dinleniyor: http://localhost:${REDIRECT_PORT}\n`);
  const openCmd = process.platform === 'win32' ? 'start' :
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${openCmd} "${authUrl.toString()}"`, (err) => {
    if (err) {
      console.log('Tarayici acılamadi. Bu URL yi manuel olarak acin:\n');
      console.log(authUrl.toString());
      console.log();
    }
  });
});
