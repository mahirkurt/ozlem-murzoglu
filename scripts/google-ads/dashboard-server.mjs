#!/usr/bin/env node
/**
 * Google Cloud Admin Dashboard Server
 * Uzm.Dr. Özlem Murzoğlu Kliniği
 *
 * Kullanım: node scripts/google-ads/dashboard-server.mjs
 * Dashboard: http://localhost:3850
 */

import express from 'express';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { GoogleAdsApi, enums } from 'google-ads-api';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');
const PORT = 3850;

const app = express();
app.use(express.json());

// --- Config ---
const PLACE_ID = 'ChIJ83R9VUTJyhQRM2o-M-eoZyQ';
const GCP_PROJECT = 'dr-murzoglu';
const GCP_PROJECT_NUMBER = '163292402794';
const ADS_CUSTOMER_ID = '1330325749';
const ADS_DEVELOPER_TOKEN = 'P1TFEieN_NSctW-hSNARYg';

// --- Auth helpers ---
function getGcloudToken() {
  try {
    return execSync('gcloud auth print-access-token --account=drmahirkurt@gmail.com 2>/dev/null', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

function getOAuthTokens() {
  const tokenFile = resolve(__dirname, 'google-ads-token.json');
  const credFile = resolve(PROJECT_ROOT, 'client_secret_google_ads.apps.googleusercontent.com.json');
  if (!existsSync(tokenFile) || !existsSync(credFile)) return null;

  const tokens = JSON.parse(readFileSync(tokenFile, 'utf-8'));
  const creds = JSON.parse(readFileSync(credFile, 'utf-8')).installed;
  return { tokens, creds };
}

async function getRefreshedOAuthToken() {
  const auth = getOAuthTokens();
  if (!auth) return null;

  const { tokens, creds } = auth;

  // Check if token still valid
  if (tokens.expiry_date && Date.now() < tokens.expiry_date - 60000) {
    return tokens.access_token;
  }

  // Refresh
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  return data.error ? null : data.access_token;
}

async function placesApi(fieldMask) {
  const token = getGcloudToken();
  if (!token) return { error: 'No gcloud token' };

  const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Goog-User-Project': GCP_PROJECT,
      'X-Goog-FieldMask': fieldMask,
      'Accept-Language': 'tr',
    },
  });
  return res.json();
}

// --- API Endpoints ---

// GBP Dashboard Data
app.get('/api/gbp/dashboard', async (req, res) => {
  try {
    const data = await placesApi(
      'displayName,formattedAddress,rating,userRatingCount,websiteUri,nationalPhoneNumber,internationalPhoneNumber,businessStatus,regularOpeningHours,currentOpeningHours,reviews,primaryType,types,googleMapsUri,photos'
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Cloud Project Info
app.get('/api/cloud/project', async (req, res) => {
  try {
    const token = getGcloudToken();
    const projectRes = await fetch(
      `https://cloudresourcemanager.googleapis.com/v1/projects/${GCP_PROJECT}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const project = await projectRes.json();

    // Get enabled services
    const servicesRes = await fetch(
      `https://serviceusage.googleapis.com/v1/projects/${GCP_PROJECT}/services?filter=state:ENABLED&pageSize=100`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const services = await servicesRes.json();

    // Get billing info
    let billing = null;
    try {
      const billingRes = await fetch(
        `https://cloudbilling.googleapis.com/v1/projects/${GCP_PROJECT}/billingInfo`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      billing = await billingRes.json();
    } catch { /* ignore */ }

    res.json({
      project,
      services: services.services?.map(s => ({
        name: s.config?.name,
        title: s.config?.title,
        state: s.state,
      })) || [],
      serviceCount: services.services?.length || 0,
      billing,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Google Ads API helpers ---
const ADS_CONFIG = {
  developer_token: ADS_DEVELOPER_TOKEN,
  customer_id: ADS_CUSTOMER_ID,
  login_customer_id: '7672524542',
};

function getAdsClient() {
  const auth = getOAuthTokens();
  if (!auth) return null;

  const client = new GoogleAdsApi({
    client_id: auth.creds.client_id,
    client_secret: auth.creds.client_secret,
    developer_token: ADS_CONFIG.developer_token,
  });

  return client.Customer({
    customer_id: ADS_CONFIG.customer_id,
    refresh_token: auth.tokens.refresh_token,
    login_customer_id: ADS_CONFIG.login_customer_id,
  });
}

function formatMicros(micros) {
  return (Number(micros || 0) / 1_000_000).toFixed(2);
}

function adsDateRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '');
  return { start: fmt(start), end: fmt(end) };
}

// Google Ads — Full Dashboard Data
app.get('/api/ads/dashboard', async (req, res) => {
  try {
    const customer = getAdsClient();
    if (!customer) {
      return res.json({ status: 'no_auth', message: 'OAuth token bulunamadi' });
    }

    const days = parseInt(req.query.days) || 30;
    const { start, end } = adsDateRange(days);

    // Fetch campaigns, ad groups, account-level metrics in parallel
    const [campaigns, adGroups, accountMetrics, conversions] = await Promise.all([
      customer.query(`
        SELECT
          campaign.id, campaign.name, campaign.status,
          campaign.advertising_channel_type, campaign.bidding_strategy_type,
          campaign_budget.amount_micros,
          metrics.impressions, metrics.clicks, metrics.ctr,
          metrics.average_cpc, metrics.cost_micros,
          metrics.conversions, metrics.cost_per_conversion,
          metrics.interactions, metrics.interaction_rate
        FROM campaign
        WHERE campaign.status != 'REMOVED'
          AND segments.date BETWEEN '${start}' AND '${end}'
      `),
      customer.query(`
        SELECT
          ad_group.id, ad_group.name, ad_group.status,
          campaign.id, campaign.name,
          metrics.impressions, metrics.clicks, metrics.ctr,
          metrics.average_cpc, metrics.cost_micros, metrics.conversions
        FROM ad_group
        WHERE ad_group.status != 'REMOVED'
          AND segments.date BETWEEN '${start}' AND '${end}'
      `),
      customer.query(`
        SELECT
          metrics.impressions, metrics.clicks, metrics.ctr,
          metrics.average_cpc, metrics.cost_micros,
          metrics.conversions, metrics.cost_per_conversion,
          metrics.interactions, metrics.interaction_rate,
          customer.descriptive_name
        FROM customer
        WHERE segments.date BETWEEN '${start}' AND '${end}'
      `),
      customer.query(`
        SELECT
          conversion_action.name, conversion_action.type,
          conversion_action.status,
          metrics.conversions, metrics.all_conversions,
          metrics.conversions_value
        FROM conversion_action
        WHERE conversion_action.status != 'REMOVED'
          AND segments.date BETWEEN '${start}' AND '${end}'
      `).catch(() => []),
    ]);

    // Aggregate account metrics
    const acct = accountMetrics[0] || {};
    const totalImpressions = Number(acct.metrics?.impressions || 0);
    const totalClicks = Number(acct.metrics?.clicks || 0);
    const totalCost = Number(acct.metrics?.cost_micros || 0);
    const totalConversions = Number(acct.metrics?.conversions || 0);
    const avgCtr = Number(acct.metrics?.ctr || 0);
    const avgCpc = Number(acct.metrics?.average_cpc || 0);
    const costPerConversion = Number(acct.metrics?.cost_per_conversion || 0);

    // Format campaigns
    const campaignData = campaigns.map(c => ({
      id: c.campaign.id,
      name: c.campaign.name,
      status: c.campaign.status,
      type: c.campaign.advertising_channel_type,
      biddingStrategy: c.campaign.bidding_strategy_type,
      dailyBudget: formatMicros(c.campaign_budget?.amount_micros),
      impressions: Number(c.metrics.impressions),
      clicks: Number(c.metrics.clicks),
      ctr: (Number(c.metrics.ctr) * 100).toFixed(2),
      avgCpc: formatMicros(c.metrics.average_cpc),
      cost: formatMicros(c.metrics.cost_micros),
      conversions: Number(c.metrics.conversions).toFixed(1),
      costPerConversion: formatMicros(c.metrics.cost_per_conversion),
    }));

    // Format ad groups
    const adGroupData = adGroups.map(ag => ({
      id: ag.ad_group.id,
      name: ag.ad_group.name,
      status: ag.ad_group.status,
      campaignId: ag.campaign.id,
      campaignName: ag.campaign.name,
      impressions: Number(ag.metrics.impressions),
      clicks: Number(ag.metrics.clicks),
      ctr: (Number(ag.metrics.ctr) * 100).toFixed(2),
      avgCpc: formatMicros(ag.metrics.average_cpc),
      cost: formatMicros(ag.metrics.cost_micros),
      conversions: Number(ag.metrics.conversions).toFixed(1),
    }));

    // Format conversions
    const conversionData = conversions.map(cv => ({
      name: cv.conversion_action.name,
      type: cv.conversion_action.type,
      status: cv.conversion_action.status,
      conversions: Number(cv.metrics?.conversions || 0).toFixed(1),
      value: formatMicros(cv.metrics?.conversions_value),
    }));

    // KPI targets
    const kpis = {
      monthlyCallTarget: { min: 30, max: 50 },
      cpaTarget: 80,
      ctrTarget: 5,
    };

    res.json({
      status: 'active',
      customerId: ADS_CUSTOMER_ID,
      accountName: acct.customer?.descriptive_name || 'Dr. Özlem Murzoğlu',
      period: { days, start, end },
      summary: {
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: (avgCtr * 100).toFixed(2),
        avgCpc: formatMicros(avgCpc),
        totalCost: formatMicros(totalCost),
        conversions: totalConversions.toFixed(1),
        costPerConversion: formatMicros(costPerConversion),
        estimatedCallValue: (totalConversions * 150).toFixed(0),
      },
      campaigns: campaignData,
      adGroups: adGroupData,
      conversions: conversionData,
      kpis,
    });
  } catch (err) {
    console.error('Ads Dashboard Error:', err.message);
    // Fallback: check basic connectivity
    const auth = getOAuthTokens();
    if (!auth) {
      return res.json({ status: 'no_auth', message: 'OAuth token bulunamadi' });
    }
    res.json({ status: 'error', message: err.message, customerId: ADS_CUSTOMER_ID });
  }
});

// Google Ads — Search Terms Report
app.get('/api/ads/search-terms', async (req, res) => {
  try {
    const customer = getAdsClient();
    if (!customer) return res.json({ status: 'no_auth' });

    const days = parseInt(req.query.days) || 30;
    const { start, end } = adsDateRange(days);

    const rows = await customer.query(`
      SELECT
        search_term_view.search_term,
        campaign.name,
        metrics.impressions, metrics.clicks, metrics.ctr,
        metrics.cost_micros, metrics.conversions
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
      ORDER BY metrics.impressions DESC
      LIMIT 50
    `);

    const terms = rows.map(r => ({
      term: r.search_term_view.search_term,
      campaign: r.campaign.name,
      impressions: Number(r.metrics.impressions),
      clicks: Number(r.metrics.clicks),
      ctr: (Number(r.metrics.ctr) * 100).toFixed(2),
      cost: formatMicros(r.metrics.cost_micros),
      conversions: Number(r.metrics.conversions).toFixed(1),
    }));

    res.json({ terms });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

// Google Ads — Daily Performance (for chart)
app.get('/api/ads/daily', async (req, res) => {
  try {
    const customer = getAdsClient();
    if (!customer) return res.json({ status: 'no_auth' });

    const days = parseInt(req.query.days) || 30;
    const { start, end } = adsDateRange(days);

    const rows = await customer.query(`
      SELECT
        segments.date,
        metrics.impressions, metrics.clicks, metrics.ctr,
        metrics.cost_micros, metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
      ORDER BY segments.date ASC
    `);

    const daily = rows.map(r => ({
      date: r.segments.date,
      impressions: Number(r.metrics.impressions),
      clicks: Number(r.metrics.clicks),
      ctr: (Number(r.metrics.ctr) * 100).toFixed(2),
      cost: formatMicros(r.metrics.cost_micros),
      conversions: Number(r.metrics.conversions).toFixed(1),
    }));

    res.json({ daily });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

// Google Ads — Keywords Performance
app.get('/api/ads/keywords', async (req, res) => {
  try {
    const customer = getAdsClient();
    if (!customer) return res.json({ status: 'no_auth' });

    const days = parseInt(req.query.days) || 30;
    const { start, end } = adsDateRange(days);

    const rows = await customer.query(`
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        ad_group.name, campaign.name,
        metrics.impressions, metrics.clicks, metrics.ctr,
        metrics.average_cpc, metrics.cost_micros, metrics.conversions
      FROM keyword_view
      WHERE ad_group_criterion.status != 'REMOVED'
        AND segments.date BETWEEN '${start}' AND '${end}'
      ORDER BY metrics.impressions DESC
      LIMIT 50
    `);

    const keywords = rows.map(r => ({
      keyword: r.ad_group_criterion.keyword.text,
      matchType: r.ad_group_criterion.keyword.match_type,
      status: r.ad_group_criterion.status,
      adGroup: r.ad_group.name,
      campaign: r.campaign.name,
      impressions: Number(r.metrics.impressions),
      clicks: Number(r.metrics.clicks),
      ctr: (Number(r.metrics.ctr) * 100).toFixed(2),
      avgCpc: formatMicros(r.metrics.average_cpc),
      cost: formatMicros(r.metrics.cost_micros),
      conversions: Number(r.metrics.conversions).toFixed(1),
    }));

    res.json({ keywords });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

// Firebase Hosting Info
app.get('/api/firebase/status', async (req, res) => {
  try {
    const token = getGcloudToken();

    // Try fetching releases from the Firebase Hosting API
    const fbRes = await fetch(
      `https://firebasehosting.googleapis.com/v1beta1/sites/dr-murzoglu/releases?pageSize=5`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await fbRes.json();

    let releases = data.releases?.map(r => ({
      name: r.name,
      type: r.type,
      createTime: r.releaseTime || r.createTime,
      user: r.releaseUser?.email,
    })) || [];

    // If no releases from API, get from git log
    if (releases.length === 0) {
      try {
        const gitLog = execSync(
          'git log --oneline --format="%H|%ai|%s" -5 2>/dev/null',
          { encoding: 'utf-8', cwd: PROJECT_ROOT }
        ).trim();
        releases = gitLog.split('\n').filter(Boolean).map(line => {
          const [hash, date, ...msg] = line.split('|');
          return {
            name: hash?.substring(0, 7),
            type: 'DEPLOY',
            createTime: date,
            user: msg.join('|'),
          };
        });
      } catch { /* ignore */ }
    }

    res.json({
      status: 'active',
      siteUrl: 'https://dr-murzoglu.web.app',
      customDomain: 'https://ozlemmurzoglu.com',
      releases,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// gcloud auth status
app.get('/api/auth/status', async (req, res) => {
  try {
    const accounts = execSync('gcloud auth list --format=json 2>/dev/null', { encoding: 'utf-8' });
    const parsed = JSON.parse(accounts);
    const oauthStatus = getOAuthTokens() ? 'active' : 'missing';

    res.json({
      gcloudAccounts: parsed.map(a => ({
        account: a.account,
        status: a.status,
      })),
      oauthToken: oauthStatus,
      activeProject: GCP_PROJECT,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Domains (GoDaddy + DNS)
// --- Cloudflare ---
function getEnvVar(key) {
  if (process.env[key]) return process.env[key];
  try {
    const env = readFileSync(resolve(PROJECT_ROOT, '.env'), 'utf-8');
    const match = env.match(new RegExp(`${key}=(.+)`));
    return match?.[1]?.trim() || null;
  } catch { return null; }
}

const CF_TOKEN = getEnvVar('CLOUDFLARE_API_TOKEN');
const CF_ZONE_ID = getEnvVar('CLOUDFLARE_ZONE_ID');
const CF_ACCOUNT_ID = getEnvVar('CLOUDFLARE_ACCOUNT_ID');

async function cfApi(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, opts);
  return res.json();
}

// Cloudflare Zone Overview
app.get('/api/cloudflare/zone', async (req, res) => {
  try {
    if (!CF_TOKEN || !CF_ZONE_ID) {
      res.json({ error: 'Cloudflare credentials missing' });
      return;
    }
    const zone = await cfApi(`/zones/${CF_ZONE_ID}`);
    res.json({
      name: zone.result?.name,
      status: zone.result?.status,
      nameServers: zone.result?.name_servers,
      plan: zone.result?.plan?.name,
      ssl: zone.result?.ssl?.status,
      paused: zone.result?.paused,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudflare DNS Records
app.get('/api/cloudflare/dns', async (req, res) => {
  try {
    if (!CF_TOKEN || !CF_ZONE_ID) {
      res.json({ error: 'Cloudflare credentials missing' });
      return;
    }
    const data = await cfApi(`/zones/${CF_ZONE_ID}/dns_records?per_page=100`);
    const records = (data.result || []).map(r => ({
      id: r.id,
      type: r.type,
      name: r.name,
      content: r.content,
      ttl: r.ttl,
      proxied: r.proxied,
      priority: r.priority,
    }));
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudflare DNS Record CRUD
app.post('/api/cloudflare/dns', async (req, res) => {
  try {
    const data = await cfApi(`/zones/${CF_ZONE_ID}/dns_records`, 'POST', req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cloudflare/dns/:id', async (req, res) => {
  try {
    const data = await cfApi(`/zones/${CF_ZONE_ID}/dns_records/${req.params.id}`, 'PUT', req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cloudflare/dns/:id', async (req, res) => {
  try {
    const data = await cfApi(`/zones/${CF_ZONE_ID}/dns_records/${req.params.id}`, 'DELETE');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudflare Analytics
app.get('/api/cloudflare/analytics', async (req, res) => {
  try {
    if (!CF_TOKEN || !CF_ZONE_ID) {
      res.json({ error: 'Cloudflare credentials missing' });
      return;
    }
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const data = await cfApi(`/zones/${CF_ZONE_ID}/analytics/dashboard?since=${since}&continuous=true`);
    res.json(data.result || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudflare SSL/TLS Settings
app.get('/api/cloudflare/ssl', async (req, res) => {
  try {
    const [ssl, always] = await Promise.all([
      cfApi(`/zones/${CF_ZONE_ID}/settings/ssl`),
      cfApi(`/zones/${CF_ZONE_ID}/settings/always_use_https`),
    ]);
    res.json({
      mode: ssl.result?.value,
      alwaysHttps: always.result?.value,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const GODADDY_KEY = getEnvVar('GODADDY_API_KEY');
const GODADDY_SECRET = getEnvVar('GODADDY_API_SECRET');

app.get('/api/domains', async (req, res) => {
  const domains = ['ozlemmurzoglu.com', 'drmurzoglu.com'];
  const results = [];

  for (const domain of domains) {
    const info = { domain, status: 'unknown', dns: {} };

    // GoDaddy domain info
    if (GODADDY_KEY && GODADDY_SECRET) {
      try {
        const gdRes = await fetch(`https://api.godaddy.com/v1/domains/${domain}`, {
          headers: { 'Authorization': `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}` },
        });
        if (gdRes.ok) {
          const gd = await gdRes.json();
          info.status = gd.status;
          info.createdAt = gd.createdAt;
          info.expires = gd.expires;
          info.renewAuto = gd.renewAuto;
          info.locked = gd.locked;
          info.privacy = gd.privacy;
          info.nameServers = gd.nameServers;
          info.renewDeadline = gd.renewDeadline;
          info.organization = gd.contactRegistrant?.organization;
        }
      } catch { /* ignore */ }
    }

    // DNS lookup via dig
    try {
      const digA = execSync(`dig +short ${domain} A 2>/dev/null`, { encoding: 'utf-8' }).trim();
      const digMX = execSync(`dig +short ${domain} MX 2>/dev/null`, { encoding: 'utf-8' }).trim();
      const digTXT = execSync(`dig +short ${domain} TXT 2>/dev/null`, { encoding: 'utf-8' }).trim();
      const digWWW = execSync(`dig +short www.${domain} 2>/dev/null`, { encoding: 'utf-8' }).trim();

      info.dns = {
        a: digA.split('\n').filter(Boolean),
        mx: digMX.split('\n').filter(Boolean),
        txt: digTXT.split('\n').filter(Boolean),
        www: digWWW.split('\n').filter(Boolean),
      };
    } catch { /* ignore */ }

    results.push(info);
  }

  res.json(results);
});

// Serve dashboard HTML
app.get('/', (req, res) => {
  const html = readFileSync(resolve(__dirname, 'dashboard.html'), 'utf-8');
  res.type('html').send(html);
});

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════╗`);
  console.log(`║   Google Cloud Admin Dashboard                   ║`);
  console.log(`║   Uzm.Dr. Özlem Murzoğlu Kliniği                ║`);
  console.log(`╠══════════════════════════════════════════════════╣`);
  console.log(`║   http://localhost:${PORT}                         ║`);
  console.log(`╚══════════════════════════════════════════════════╝\n`);
});
