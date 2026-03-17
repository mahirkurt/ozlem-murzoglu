#!/usr/bin/env node
/**
 * Google Ads CLI Manager - Uzm.Dr. Özlem Murzoğlu Kliniği
 *
 * Kullanım:
 *   node scripts/google-ads/ads-manager.mjs <komut> [seçenekler]
 *
 * Komutlar:
 *   campaigns          Kampanyaları listele
 *   campaign:details   Kampanya detayları
 *   campaign:enable    Kampanyayı etkinleştir
 *   campaign:pause     Kampanyayı duraklat
 *   campaign:create    Yeni kampanya oluştur
 *   adgroups           Reklam gruplarını listele
 *   adgroup:create     Yeni reklam grubu oluştur
 *   ads                Reklamları listele
 *   ad:create          Responsive search ad oluştur
 *   keywords           Anahtar kelimeleri listele
 *   keyword:add        Anahtar kelime ekle
 *   keyword:remove     Anahtar kelime kaldır
 *   keyword:bulk-add   Toplu anahtar kelime ekle
 *   negative:add       Negatif anahtar kelime ekle
 *   budget             Bütçeleri listele
 *   budget:update      Bütçe güncelle
 *   metrics            Performans metrikleri
 *   search-terms       Arama terimlerini listele
 *   conversions        Dönüşüm aksiyonlarını listele
 *   conversion:create  Yeni dönüşüm aksiyonu oluştur
 *   extension:sitelinks  Sitelink uzantıları ekle
 *   extension:call     Arama uzantısı ekle
 *   extension:callouts Açıklama uzantıları ekle
 *   asset:upload       Görsel asset yükle (logo/image)
 *   asset:list         Görsel asset'leri listele
 *   asset:link         Asset'i kampanyaya bağla
 *   setup:full         Tam strateji kurulumu (hepsini birden)
 *   account            Hesap bilgilerini göster
 *   help               Yardım
 */

import { GoogleAdsApi, enums } from 'google-ads-api';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');

// --- Configuration ---
const CONFIG = {
  developer_token: 'P1TFEieN_NSctW-hSNARYg',
  customer_id: '1330325749',        // Kampanyaların yürütüldüğü hesap
  login_customer_id: '7672524542',  // Yönetici hesabı (klinik@drmurzoglu.com)
};

// --- Auth helpers ---
function loadCredentials() {
  const credFile = resolve(PROJECT_ROOT, 'client_secret_google_ads.apps.googleusercontent.com.json');
  if (!existsSync(credFile)) {
    console.error('OAuth2 credentials bulunamadi. Dosya:', credFile);
    process.exit(1);
  }
  return JSON.parse(readFileSync(credFile, 'utf-8')).installed;
}

function loadTokens() {
  const tokenFile = resolve(__dirname, 'google-ads-token.json');
  if (!existsSync(tokenFile)) {
    console.error('Refresh token bulunamadi. Once setup yapin:');
    console.error('  node scripts/google-ads/setup-auth.mjs');
    process.exit(1);
  }
  return JSON.parse(readFileSync(tokenFile, 'utf-8'));
}

function getApiInstance() {
  const creds = loadCredentials();
  const tokens = loadTokens();

  const client = new GoogleAdsApi({
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    developer_token: CONFIG.developer_token,
  });

  return { client, tokens };
}

function getClient(customerId) {
  const { client, tokens } = getApiInstance();

  const opts = {
    customer_id: customerId || CONFIG.customer_id,
    refresh_token: tokens.refresh_token,
  };
  if (CONFIG.login_customer_id) opts.login_customer_id = CONFIG.login_customer_id;
  return client.Customer(opts);
}

function getManagerClient() {
  const { client, tokens } = getApiInstance();
  return client.Customer({
    customer_id: CONFIG.login_customer_id,
    refresh_token: tokens.refresh_token,
  });
}

// --- API helpers ---
// google-ads-api create() may return: a string, an array of strings,
// or an object with results/resource_names arrays
function first(result) {
  if (typeof result === 'string') return result;
  if (Array.isArray(result)) return result[0];
  if (result?.results) return result.results[0]?.resource_name || result.results[0];
  if (result?.resource_names) return result.resource_names[0];
  return result;
}

// --- Formatting helpers ---
function formatMicros(micros) {
  return (Number(micros) / 1_000_000).toFixed(2);
}

function formatStatus(status) {
  const map = {
    2: 'ENABLED',
    3: 'PAUSED',
    4: 'REMOVED',
  };
  return map[status] || `UNKNOWN(${status})`;
}

function table(rows, headers) {
  if (rows.length === 0) {
    console.log('  (sonuc yok)');
    return;
  }
  // Calculate column widths
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length))
  );
  const sep = widths.map(w => '-'.repeat(w)).join('-+-');
  const fmt = (row) => row.map((c, i) => String(c ?? '').padEnd(widths[i])).join(' | ');

  console.log(fmt(headers));
  console.log(sep);
  rows.forEach(r => console.log(fmt(r)));
  console.log(`\n  Toplam: ${rows.length} kayit`);
}

// --- Date helpers ---
function dateRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: start.toISOString().split('T')[0].replace(/-/g, ''),
    end: end.toISOString().split('T')[0].replace(/-/g, ''),
    startFmt: start.toISOString().split('T')[0],
    endFmt: end.toISOString().split('T')[0],
  };
}

// --- Commands ---

async function cmdAccount(customer) {
  const [account] = await customer.query(`
    SELECT
      customer.id,
      customer.descriptive_name,
      customer.currency_code,
      customer.time_zone,
      customer.status
    FROM customer
    LIMIT 1
  `);

  const c = account.customer;
  console.log('\n=== Hesap Bilgileri ===');
  console.log(`  Hesap ID:    ${c.id}`);
  console.log(`  Hesap Adi:   ${c.descriptive_name}`);
  console.log(`  Para Birimi: ${c.currency_code}`);
  console.log(`  Zaman Dilimi:${c.time_zone}`);
  console.log(`  Durum:       ${formatStatus(c.status)}`);
}

async function cmdCampaigns(customer) {
  const campaigns = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE campaign.status != 'REMOVED'
    ORDER BY campaign.name
  `);

  console.log('\n=== Kampanyalar ===\n');
  table(
    campaigns.map(c => [
      c.campaign.id,
      c.campaign.name,
      formatStatus(c.campaign.status),
      formatMicros(c.campaign_budget?.amount_micros) + ' TL/gun',
      c.metrics.impressions,
      c.metrics.clicks,
      formatMicros(c.metrics.cost_micros) + ' TL',
      Number(c.metrics.conversions).toFixed(1),
    ]),
    ['ID', 'Kampanya', 'Durum', 'Butce', 'Gosterim', 'Tiklama', 'Maliyet', 'Donusum']
  );
}

async function cmdCampaignDetails(customer, campaignId) {
  if (!campaignId) {
    console.error('Kampanya ID gerekli: --id=XXXXXXX');
    process.exit(1);
  }

  const { startFmt, endFmt } = dateRange(30);

  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.bidding_strategy_type,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_micros,
      metrics.conversions,
      metrics.cost_per_conversion
    FROM campaign
    WHERE campaign.id = ${campaignId}
  `);

  if (rows.length === 0) {
    console.error('Kampanya bulunamadi:', campaignId);
    return;
  }

  const c = rows[0];
  console.log(`\n=== Kampanya Detayi: ${c.campaign.name} ===`);
  console.log(`  ID:              ${c.campaign.id}`);
  console.log(`  Durum:           ${formatStatus(c.campaign.status)}`);
  console.log(`  Kanal:           ${c.campaign.advertising_channel_type}`);
  console.log(`  Teklif Stratejisi: ${c.campaign.bidding_strategy_type}`);
  console.log(`  Gunluk Butce:    ${formatMicros(c.campaign_budget?.amount_micros)} TL`);
  console.log(`\n  --- Performans (${startFmt} - ${endFmt}) ---`);
  console.log(`  Gosterim:        ${c.metrics.impressions}`);
  console.log(`  Tiklama:         ${c.metrics.clicks}`);
  console.log(`  TO (CTR):        ${(Number(c.metrics.ctr) * 100).toFixed(2)}%`);
  console.log(`  Ort. TBM (CPC):  ${formatMicros(c.metrics.average_cpc)} TL`);
  console.log(`  Toplam Maliyet:  ${formatMicros(c.metrics.cost_micros)} TL`);
  console.log(`  Donusum:         ${Number(c.metrics.conversions).toFixed(1)}`);
  console.log(`  Donusum Basina:  ${formatMicros(c.metrics.cost_per_conversion)} TL`);
}

async function cmdCampaignSetStatus(customer, campaignId, status) {
  if (!campaignId) {
    console.error('Kampanya ID gerekli: --id=XXXXXXX');
    process.exit(1);
  }

  const statusEnum = status === 'ENABLED' ? enums.CampaignStatus.ENABLED : enums.CampaignStatus.PAUSED;

  await customer.campaigns.update([{
    resource_name: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
    status: statusEnum,
  }]);

  console.log(`\nKampanya ${campaignId} durumu: ${status}`);
}

async function cmdCampaignSetBidding(customer, campaignId, strategy, maxCpc) {
  if (!campaignId || !strategy) {
    console.error('Kullanim: campaign:set-bidding --id=XXX --strategy=maximize_clicks|maximize_conversions [--max-cpc=15]');
    process.exit(1);
  }

  const update = {
    resource_name: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
  };

  switch (strategy.toLowerCase()) {
    case 'maximize_clicks':
      update.target_spend = maxCpc
        ? { cpc_bid_ceiling_micros: Math.round(parseFloat(maxCpc) * 1_000_000) }
        : {};
      break;
    case 'maximize_conversions':
      update.maximize_conversions = {};
      break;
    case 'manual_cpc':
      update.manual_cpc = { enhanced_cpc_enabled: true };
      break;
    default:
      console.error(`Bilinmeyen strateji: ${strategy}. Secenekler: maximize_clicks, maximize_conversions, manual_cpc`);
      process.exit(1);
  }

  await customer.campaigns.update([update]);
  console.log(`\nKampanya ${campaignId} teklif stratejisi: ${strategy.toUpperCase()}${maxCpc ? ` (max CPC: ${maxCpc} TL)` : ''}`);
}

async function cmdCampaignRemove(customer, campaignId) {
  if (!campaignId) {
    console.error('Kampanya ID gerekli: --id=XXXXXXX');
    process.exit(1);
  }

  await customer.campaigns.remove([`customers/${CONFIG.customer_id}/campaigns/${campaignId}`]);

  console.log(`\nKampanya ${campaignId} kaldirildi (REMOVED)`);
}

async function cmdAdGroups(customer, campaignId) {
  const where = campaignId ? `AND campaign.id = ${campaignId}` : '';
  const adGroups = await customer.query(`
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group.status,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM ad_group
    WHERE ad_group.status != 'REMOVED' ${where}
    ORDER BY campaign.name, ad_group.name
  `);

  console.log('\n=== Reklam Gruplari ===\n');
  table(
    adGroups.map(a => [
      a.ad_group.id,
      a.campaign.name,
      a.ad_group.name,
      formatStatus(a.ad_group.status),
      a.metrics.impressions,
      a.metrics.clicks,
      formatMicros(a.metrics.cost_micros) + ' TL',
    ]),
    ['ID', 'Kampanya', 'Reklam Grubu', 'Durum', 'Gosterim', 'Tiklama', 'Maliyet']
  );
}

async function cmdAds(customer, campaignId) {
  const where = campaignId ? `AND campaign.id = ${campaignId}` : '';
  const ads = await customer.query(`
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.ad.name,
      ad_group_ad.status,
      ad_group_ad.ad.type,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group.name,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.cost_micros
    FROM ad_group_ad
    WHERE ad_group_ad.status != 'REMOVED' ${where}
    ORDER BY campaign.name
  `);

  console.log('\n=== Reklamlar ===\n');
  for (const ad of ads) {
    const headlines = ad.ad_group_ad.ad.responsive_search_ad?.headlines?.map(h => h.text).join(' | ') || '-';
    console.log(`  [${ad.ad_group_ad.ad.id}] ${ad.campaign.name} > ${ad.ad_group.name}`);
    console.log(`    Durum: ${formatStatus(ad.ad_group_ad.status)} | Tip: ${ad.ad_group_ad.ad.type}`);
    console.log(`    Basliklar: ${headlines}`);
    console.log(`    Gosterim: ${ad.metrics.impressions} | Tiklama: ${ad.metrics.clicks} | CTR: ${(Number(ad.metrics.ctr) * 100).toFixed(2)}% | Maliyet: ${formatMicros(ad.metrics.cost_micros)} TL`);
    console.log('');
  }
  console.log(`  Toplam: ${ads.length} reklam`);
}

async function cmdKeywords(customer, campaignId) {
  const where = campaignId ? `AND campaign.id = ${campaignId}` : '';
  const keywords = await customer.query(`
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group_criterion.criterion_id,
      ad_group.id,
      ad_group.name,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.average_cpc
    FROM keyword_view
    WHERE ad_group_criterion.status != 'REMOVED' ${where}
    ORDER BY metrics.impressions DESC
  `);

  console.log('\n=== Anahtar Kelimeler ===\n');
  table(
    keywords.map(k => [
      k.ad_group_criterion.criterion_id,
      k.ad_group.id,
      k.ad_group.name?.substring(0, 15),
      k.ad_group_criterion.keyword.text,
      k.ad_group_criterion.keyword.match_type,
      formatStatus(k.ad_group_criterion.status),
      k.metrics.impressions,
      k.metrics.clicks,
      formatMicros(k.metrics.cost_micros) + ' TL',
    ]),
    ['ID', 'AdGroup ID', 'Reklam Grubu', 'Anahtar Kelime', 'Eslesme', 'Durum', 'Gosterim', 'Tiklama', 'Maliyet']
  );
}

async function cmdKeywordAdd(customer, adGroupId, keyword, matchType = 'PHRASE') {
  if (!adGroupId || !keyword) {
    console.error('Kullanim: keyword:add --adgroup=XXX --keyword="cocuk doktoru" [--match=EXACT|PHRASE|BROAD]');
    process.exit(1);
  }

  const matchTypeEnum = {
    EXACT: enums.KeywordMatchType.EXACT,
    PHRASE: enums.KeywordMatchType.PHRASE,
    BROAD: enums.KeywordMatchType.BROAD,
  }[matchType.toUpperCase()] || enums.KeywordMatchType.PHRASE;

  try {
    // Try normal create first
    first(await customer.adGroupCriteria.create([{
      ad_group: `customers/${CONFIG.customer_id}/adGroups/${adGroupId}`,
      keyword: { text: keyword, match_type: matchTypeEnum },
      status: enums.AdGroupCriterionStatus.ENABLED,
    }]));
  } catch (e) {
    // If policy violation and exemptible, retry with exemption
    const policyKey = e.errors?.[0]?.details?.policy_violation_details?.key;
    if (policyKey?.policy_name && e.errors?.[0]?.details?.policy_violation_details?.is_exemptible) {
      await customer.mutateResources([{
        entity: 'ad_group_criterion',
        operation: 'create',
        resource: {
          ad_group: `customers/${CONFIG.customer_id}/adGroups/${adGroupId}`,
          keyword: { text: keyword, match_type: matchTypeEnum },
          status: enums.AdGroupCriterionStatus.ENABLED,
        },
        exempt_policy_violation_keys: [policyKey],
      }]);
    } else {
      throw e;
    }
  }

  console.log(`\nAnahtar kelime eklendi: "${keyword}" (${matchType}) -> adGroup ${adGroupId}`);
}

async function cmdKeywordRemove(customer, criterionId, adGroupId) {
  if (!criterionId || !adGroupId) {
    console.error('Kullanim: keyword:remove --id=XXX --adgroup=XXX');
    process.exit(1);
  }

  await customer.adGroupCriteria.remove([
    `customers/${CONFIG.customer_id}/adGroupCriteria/${adGroupId}~${criterionId}`,
  ]);

  console.log(`\nAnahtar kelime kaldirildi: criterion ${criterionId}`);
}

async function cmdBudget(customer) {
  const budgets = await customer.query(`
    SELECT
      campaign_budget.id,
      campaign_budget.name,
      campaign_budget.amount_micros,
      campaign_budget.status,
      campaign_budget.delivery_method,
      campaign.name,
      campaign.status
    FROM campaign_budget
    WHERE campaign_budget.status != 'REMOVED'
    ORDER BY campaign.name
  `);

  console.log('\n=== Butceler ===\n');
  table(
    budgets.map(b => [
      b.campaign_budget.id,
      b.campaign?.name || '-',
      formatMicros(b.campaign_budget.amount_micros) + ' TL/gun',
      formatStatus(b.campaign_budget.status),
      b.campaign_budget.delivery_method,
    ]),
    ['Butce ID', 'Kampanya', 'Gunluk Butce', 'Durum', 'Dagitim']
  );
}

async function cmdBudgetUpdate(customer, budgetId, amount) {
  if (!budgetId || !amount) {
    console.error('Kullanim: budget:update --id=XXX --amount=50 (TL cinsinden gunluk)');
    process.exit(1);
  }

  const amountMicros = Math.round(parseFloat(amount) * 1_000_000);

  await customer.campaignBudgets.update([{
    resource_name: `customers/${CONFIG.customer_id}/campaignBudgets/${budgetId}`,
    amount_micros: amountMicros,
  }]);

  console.log(`\nButce guncellendi: ${budgetId} -> ${amount} TL/gun`);
}

async function cmdBudgetRemove(customer, budgetId) {
  if (!budgetId) {
    console.error('Kullanim: budget:remove --id=XXX');
    process.exit(1);
  }
  try {
    await customer.campaignBudgets.remove([
      `customers/${CONFIG.customer_id}/campaignBudgets/${budgetId}`
    ]);
    console.log(`Butce kaldirildi: ${budgetId}`);
  } catch (e) {
    console.error(`Butce kaldirilamadi ${budgetId}: ${e.message}`);
  }
}

async function cmdMetrics(customer, days = 30) {
  const { startFmt, endFmt } = dateRange(days);

  const rows = await customer.query(`
    SELECT
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_micros,
      metrics.conversions,
      metrics.cost_per_conversion,
      metrics.search_impression_share
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND segments.date BETWEEN '${startFmt}' AND '${endFmt}'
    ORDER BY metrics.cost_micros DESC
  `);

  console.log(`\n=== Performans Metrikleri (${startFmt} - ${endFmt}) ===\n`);
  table(
    rows.map(r => [
      r.campaign.name?.substring(0, 25),
      r.metrics.impressions,
      r.metrics.clicks,
      (Number(r.metrics.ctr) * 100).toFixed(2) + '%',
      formatMicros(r.metrics.average_cpc) + ' TL',
      formatMicros(r.metrics.cost_micros) + ' TL',
      Number(r.metrics.conversions).toFixed(1),
      r.metrics.search_impression_share ? (Number(r.metrics.search_impression_share) * 100).toFixed(0) + '%' : '-',
    ]),
    ['Kampanya', 'Gosterim', 'Tiklama', 'CTR', 'Ort.CPC', 'Maliyet', 'Donusum', 'IS%']
  );

  // Totals
  const totals = rows.reduce((acc, r) => ({
    impressions: acc.impressions + Number(r.metrics.impressions),
    clicks: acc.clicks + Number(r.metrics.clicks),
    cost: acc.cost + Number(r.metrics.cost_micros),
    conversions: acc.conversions + Number(r.metrics.conversions),
  }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 });

  console.log(`\n  --- Toplam ---`);
  console.log(`  Gosterim:   ${totals.impressions.toLocaleString('tr-TR')}`);
  console.log(`  Tiklama:    ${totals.clicks.toLocaleString('tr-TR')}`);
  console.log(`  CTR:        ${totals.impressions ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0}%`);
  console.log(`  Maliyet:    ${formatMicros(totals.cost)} TL`);
  console.log(`  Donusum:    ${totals.conversions.toFixed(1)}`);
}

async function cmdSearchTerms(customer, campaignId, days = 30) {
  const { startFmt, endFmt } = dateRange(days);
  const where = campaignId ? `AND campaign.id = ${campaignId}` : '';

  const terms = await customer.query(`
    SELECT
      search_term_view.search_term,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date BETWEEN '${startFmt}' AND '${endFmt}' ${where}
    ORDER BY metrics.impressions DESC
    LIMIT 50
  `);

  console.log(`\n=== Arama Terimleri (Son ${days} Gun, Top 50) ===\n`);
  table(
    terms.map(t => [
      t.search_term_view.search_term,
      t.campaign.name?.substring(0, 20),
      t.metrics.impressions,
      t.metrics.clicks,
      formatMicros(t.metrics.cost_micros) + ' TL',
      Number(t.metrics.conversions).toFixed(1),
    ]),
    ['Arama Terimi', 'Kampanya', 'Gosterim', 'Tiklama', 'Maliyet', 'Donusum']
  );
}

// --- Creation & Setup Commands ---

async function cmdConversionCreate(customer, name, category, value) {
  if (!name) {
    console.error('Kullanim: conversion:create --name="..." --category=PHONE_CALL|SUBMIT_LEAD_FORM|OTHER --value=100');
    process.exit(1);
  }

  const categoryEnum = {
    'PHONE_CALL': enums.ConversionActionCategory.PHONE_CALL_LEAD,
    'SUBMIT_LEAD_FORM': enums.ConversionActionCategory.SUBMIT_LEAD_FORM,
    'OTHER': enums.ConversionActionCategory.DEFAULT,
  }[category] || enums.ConversionActionCategory.DEFAULT;

  const result = first(await customer.conversionActions.create([{
    name: name,
    category: categoryEnum,
    type: enums.ConversionActionType.WEBPAGE,
    status: enums.ConversionActionStatus.ENABLED,
    value_settings: {
      default_value: parseFloat(value),
      default_currency_code: 'TRY',
      always_use_default_value: false,
    },
    counting_type: enums.ConversionActionCountingType.ONE_PER_CLICK,
    attribution_model_settings: {
      attribution_model: enums.AttributionModel.GOOGLE_ADS_LAST_CLICK,
    },
  }]));

  console.log(`\nDonusum aksiyonu olusturuldu: "${name}"`);
  console.log(`  Kategori: ${category}`);
  console.log(`  Deger: ${value} TL`);
  console.log(`  Resource: ${result}`);
}

async function cmdConversionList(customer) {
  const rows = await customer.query(`
    SELECT
      conversion_action.id,
      conversion_action.name,
      conversion_action.category,
      conversion_action.status,
      conversion_action.type,
      conversion_action.value_settings.default_value
    FROM conversion_action
    WHERE conversion_action.status != 'REMOVED'
    ORDER BY conversion_action.name
  `);

  console.log('\n=== Donusum Aksiyonlari ===\n');
  table(
    rows.map(r => [
      r.conversion_action.id,
      r.conversion_action.name,
      r.conversion_action.category,
      formatStatus(r.conversion_action.status),
      r.conversion_action.type,
      r.conversion_action.value_settings?.default_value ?? '-',
    ]),
    ['ID', 'Ad', 'Kategori', 'Durum', 'Tip', 'Deger']
  );
}

async function cmdCampaignCreate(customer, name, channelType, dailyBudgetTL, biddingStrategy) {
  if (!name || !dailyBudgetTL) {
    console.error('Kullanim: campaign:create --name="..." --budget=50 [--channel=SEARCH|PERFORMANCE_MAX] [--bidding=MAXIMIZE_CONVERSIONS|TARGET_CPA]');
    process.exit(1);
  }

  // Step 1: Create budget
  const budgetMicros = Math.round(parseFloat(dailyBudgetTL) * 1_000_000);
  const budgetResult = first(await customer.campaignBudgets.create([{
    name: `${name} - Butce`,
    amount_micros: budgetMicros,
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    explicitly_shared: false,
  }]));

  // Step 2: Create campaign
  const channelEnum = channelType === 'PERFORMANCE_MAX'
    ? enums.AdvertisingChannelType.PERFORMANCE_MAX
    : enums.AdvertisingChannelType.SEARCH;

  const campaignData = {
    name: name,
    status: enums.CampaignStatus.PAUSED, // Start paused for safety
    advertising_channel_type: channelEnum,
    campaign_budget: budgetResult,
    // Required since Sept 2025 — EU Political Ads Regulation compliance
    contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
  };

  // Add bidding strategy
  if (biddingStrategy === 'TARGET_CPA') {
    campaignData.target_cpa = { target_cpa_micros: 80_000_000 }; // 80 TL default
  } else {
    campaignData.maximize_conversions = {};
  }

  // For SEARCH campaigns, add network settings
  if (channelType === 'SEARCH') {
    campaignData.network_settings = {
      target_google_search: true,
      target_search_network: false,
      target_content_network: false,
    };
  }

  let campaignResult;

  if (channelType === 'PERFORMANCE_MAX') {
    // PMax requires brand assets linked atomically via single mutate
    const tempBizNameId = -1;
    const tempCampaignId = -2;
    const custPrefix = `customers/${CONFIG.customer_id}`;

    const mutateOps = [
      // 1. Create business name asset
      { entity: 'asset', operation: 'create', resource: {
        resource_name: `${custPrefix}/assets/${tempBizNameId}`,
        name: `${name} - Business Name`,
        text_asset: { text: 'Dr. Özlem Murzoğlu' },
        type: enums.AssetType.BUSINESS_NAME,
      }},
      // 2. Create campaign
      { entity: 'campaign', operation: 'create', resource: {
        resource_name: `${custPrefix}/campaigns/${tempCampaignId}`,
        ...campaignData,
      }},
      // 3. Link business name
      { entity: 'campaign_asset', operation: 'create', resource: {
        campaign: `${custPrefix}/campaigns/${tempCampaignId}`,
        asset: `${custPrefix}/assets/${tempBizNameId}`,
        field_type: enums.AssetFieldType.BUSINESS_NAME,
      }},
      // 4. Link square logo (OM-Square-Color 1620x1620)
      { entity: 'campaign_asset', operation: 'create', resource: {
        campaign: `${custPrefix}/campaigns/${tempCampaignId}`,
        asset: `${custPrefix}/assets/284058340460`,
        field_type: enums.AssetFieldType.LOGO,
      }},
    ];

    const results = await customer.mutateResources(mutateOps);
    campaignResult = results?.mutate_operation_responses?.[1]?.campaign_result?.resource_name ||
                     `${custPrefix}/campaigns/unknown`;
    console.log('  Brand Guidelines: business name + logo linked');
  } else {
    campaignResult = first(await customer.campaigns.create([campaignData]));
  }

  console.log(`\nKampanya olusturuldu: "${name}"`);
  console.log(`  Kanal: ${channelType}`);
  console.log(`  Gunluk Butce: ${dailyBudgetTL} TL`);
  console.log(`  Teklif: ${biddingStrategy}`);
  console.log(`  Durum: PAUSED (guvenlik icin)`);
  console.log(`  Resource: ${campaignResult}`);

  return campaignResult;
}

async function cmdAssetGroupCreate(customer, campaignId, name, finalUrl) {
  if (!campaignId || !name) {
    console.error('Kullanim: assetgroup:create --campaign=XXX --name="..." [--url=https://...]');
    process.exit(1);
  }

  const custPrefix = `customers/${CONFIG.customer_id}`;
  const campaignResource = `${custPrefix}/campaigns/${campaignId}`;
  const url = finalUrl || 'https://ozlemmurzoglu.com';

  // --- Step 1: Create text assets ---
  console.log('  Text asset\'ler olusturuluyor...');

  const headlines = [
    'Ataşehir Çocuk Doktoru',
    'Dr. Özlem Murzoğlu',
    'Hemen Randevu Alın',
    'Bright Futures Sertifikalı',
    'Uzman Pediatrist Ataşehir',
    '7 Uzmanlık Alanı',
    'Pzt-Cum 09:00-18:00',
  ];
  const longHeadlines = [
    'Uzm. Dr. Özlem Murzoğlu Ataşehir Sosyal Pediatri Kliniği',
    'Çocuğunuzun Sağlığı İçin 7 Uzmanlık Alanında Hizmet',
  ];
  const descriptions = [
    'Çocuğunuzun sağlığı güvende. Aşı takibi, gelişim kontrolü ve özel programlar.',
    'Bright Futures gelişim takibi. 7 uzmanlık alanında hizmet. Randevu alın.',
  ];

  const headlineIds = [];
  for (const h of headlines) {
    const res = first(await customer.assets.create([{ text_asset: { text: h } }]));
    headlineIds.push(res);
    console.log(`    + headline: "${h}"`);
  }
  const longHeadlineIds = [];
  for (const lh of longHeadlines) {
    const res = first(await customer.assets.create([{ text_asset: { text: lh } }]));
    longHeadlineIds.push(res);
    console.log(`    + long headline: "${lh}"`);
  }
  const descriptionIds = [];
  for (const d of descriptions) {
    const res = first(await customer.assets.create([{ text_asset: { text: d } }]));
    descriptionIds.push(res);
    console.log(`    + description: "${d.substring(0, 40)}..."`);
  }

  // --- Step 2: Create asset group + link everything ---
  console.log('  Asset group olusturuluyor...');

  const tempAgId = -10;
  const ops = [
    // Create asset group
    { entity: 'asset_group', operation: 'create', resource: {
      resource_name: `${custPrefix}/assetGroups/${tempAgId}`,
      campaign: campaignResource,
      name: name,
      final_urls: [url],
      status: enums.AssetGroupStatus.ENABLED,
    }},
  ];

  // Link headlines
  for (const id of headlineIds) {
    ops.push({ entity: 'asset_group_asset', operation: 'create', resource: {
      asset_group: `${custPrefix}/assetGroups/${tempAgId}`,
      asset: id,
      field_type: enums.AssetFieldType.HEADLINE,
    }});
  }
  // Link long headlines
  for (const id of longHeadlineIds) {
    ops.push({ entity: 'asset_group_asset', operation: 'create', resource: {
      asset_group: `${custPrefix}/assetGroups/${tempAgId}`,
      asset: id,
      field_type: enums.AssetFieldType.LONG_HEADLINE,
    }});
  }
  // Link descriptions
  for (const id of descriptionIds) {
    ops.push({ entity: 'asset_group_asset', operation: 'create', resource: {
      asset_group: `${custPrefix}/assetGroups/${tempAgId}`,
      asset: id,
      field_type: enums.AssetFieldType.DESCRIPTION,
    }});
  }
  // Link existing images (logo is already at campaign level via Brand Guidelines)
  ops.push({ entity: 'asset_group_asset', operation: 'create', resource: {
    asset_group: `${custPrefix}/assetGroups/${tempAgId}`,
    asset: `${custPrefix}/assets/339653014637`, // OM-Comp landscape 1.91:1
    field_type: enums.AssetFieldType.MARKETING_IMAGE,
  }});
  ops.push({ entity: 'asset_group_asset', operation: 'create', resource: {
    asset_group: `${custPrefix}/assetGroups/${tempAgId}`,
    asset: `${custPrefix}/assets/284058340460`, // OM-Square 1:1
    field_type: enums.AssetFieldType.SQUARE_MARKETING_IMAGE,
  }});

  await customer.mutateResources(ops);

  console.log(`\nAsset Group olusturuldu: "${name}"`);
  console.log(`  Kampanya: ${campaignId}`);
  console.log(`  Final URL: ${url}`);
  console.log(`  Headlines: ${headlines.length}, Long: ${longHeadlines.length}, Desc: ${descriptions.length}`);
  console.log(`  Images: 3 (landscape, square, logo)`);
}

async function cmdAdGroupCreate(customer, campaignId, name, cpcBidTL) {
  if (!campaignId || !name) {
    console.error('Kullanim: adgroup:create --campaign=XXX --name="..." [--cpc=5]');
    process.exit(1);
  }

  const cpcMicros = cpcBidTL ? Math.round(parseFloat(cpcBidTL) * 1_000_000) : 5_000_000; // default 5 TL

  const result = first(await customer.adGroups.create([{
    campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
    name: name,
    status: enums.AdGroupStatus.ENABLED,
    type: enums.AdGroupType.SEARCH_STANDARD,
    cpc_bid_micros: cpcMicros,
  }]));

  console.log(`\nReklam grubu olusturuldu: "${name}"`);
  console.log(`  Kampanya: ${campaignId}`);
  console.log(`  Varsayilan CPC: ${cpcBidTL || '5'} TL`);
  console.log(`  Resource: ${result}`);

  return result;
}

async function cmdAdCreate(customer, adGroupId, headlines, descriptions, finalUrl) {
  if (!adGroupId || !headlines || !descriptions) {
    console.error('Kullanim: ad:create --adgroup=XXX --headlines="H1,H2,H3" --descriptions="D1,D2" [--url=https://...]');
    process.exit(1);
  }

  // headlines: comma-separated string "Baslik 1,Baslik 2,Baslik 3"
  // descriptions: comma-separated string "Aciklama 1,Aciklama 2"
  const headlinesList = headlines.split(',').map((h, i) => ({
    text: h.trim(),
    pinned_field: i < 3 ? undefined : undefined, // no pinning
  }));

  const descList = descriptions.split(',').map(d => ({
    text: d.trim(),
  }));

  const adData = {
    ad_group: `customers/${CONFIG.customer_id}/adGroups/${adGroupId}`,
    status: enums.AdGroupAdStatus.ENABLED,
    ad: {
      responsive_search_ad: {
        headlines: headlinesList,
        descriptions: descList,
      },
      final_urls: [finalUrl || 'https://ozlemmurzoglu.com'],
    },
  };

  let result;
  try {
    result = first(await customer.adGroupAds.create([adData]));
  } catch (e) {
    // Collect all exemptible policy keys and retry
    const keys = (e.errors || [])
      .filter(err => err.details?.policy_violation_details?.is_exemptible)
      .map(err => err.details.policy_violation_details.key);
    if (keys.length > 0) {
      const res = await customer.mutateResources([{
        entity: 'ad_group_ad',
        operation: 'create',
        resource: adData,
        exempt_policy_violation_keys: keys,
      }]);
      result = res?.mutate_operation_responses?.[0]?.ad_group_ad_result?.resource_name || 'created';
    } else {
      throw e;
    }
  }

  console.log(`\nReklam olusturuldu: ${headlinesList.length} baslik, ${descList.length} aciklama`);
  console.log(`  Reklam Grubu: ${adGroupId}`);
  console.log(`  URL: ${finalUrl || 'https://ozlemmurzoglu.com'}`);
  console.log(`  Resource: ${result}`);
}

async function cmdKeywordBulkAdd(customer, adGroupId, keywordsStr, matchType = 'PHRASE') {
  if (!adGroupId || !keywordsStr) {
    console.error('Kullanim: keyword:bulk-add --adgroup=XXX --keywords="kw1;kw2;kw3" [--match=EXACT|PHRASE|BROAD]');
    process.exit(1);
  }

  // keywordsStr: semicolon-separated "keyword1;keyword2;keyword3"
  const keywords = keywordsStr.split(';').map(k => k.trim()).filter(Boolean);

  const matchTypeEnum = {
    EXACT: enums.KeywordMatchType.EXACT,
    PHRASE: enums.KeywordMatchType.PHRASE,
    BROAD: enums.KeywordMatchType.BROAD,
  }[matchType.toUpperCase()] || enums.KeywordMatchType.PHRASE;

  let added = 0;
  for (const kw of keywords) {
    try {
      await customer.adGroupCriteria.create([{
        ad_group: `customers/${CONFIG.customer_id}/adGroups/${adGroupId}`,
        keyword: { text: kw, match_type: matchTypeEnum },
        status: enums.AdGroupCriterionStatus.ENABLED,
      }]);
      added++;
      console.log(`  + "${kw}" (${matchType})`);
    } catch (e) {
      console.error(`  x "${kw}": ${e.message}`);
    }
  }
  console.log(`\n${added}/${keywords.length} anahtar kelime eklendi.`);
}

async function cmdNegativeAdd(customer, campaignId, keywordsStr) {
  if (!campaignId || !keywordsStr) {
    console.error('Kullanim: negative:add --campaign=XXX --keywords="kw1;kw2;kw3"');
    process.exit(1);
  }

  // keywordsStr: semicolon-separated
  const keywords = keywordsStr.split(';').map(k => k.trim()).filter(Boolean);

  let added = 0;
  for (const kw of keywords) {
    try {
      await customer.campaignCriteria.create([{
        campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
        keyword: { text: kw, match_type: enums.KeywordMatchType.BROAD },
        negative: true,
      }]);
      added++;
      console.log(`  - "${kw}"`);
    } catch (e) {
      console.error(`  x "${kw}": ${e.message}`);
    }
  }
  console.log(`\n${added}/${keywords.length} negatif kelime eklendi.`);
}

async function cmdNegativeList(customer, campaignId) {
  if (!campaignId) {
    console.error('Kullanim: negative:list --campaign=XXX');
    process.exit(1);
  }
  const query = `
    SELECT campaign_criterion.criterion_id, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id = ${campaignId}
      AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
    ORDER BY campaign_criterion.keyword.text
  `;
  const rows = await customer.query(query);
  console.log(`\n=== Negatif Anahtar Kelimeler (Kampanya ${campaignId}) ===\n`);
  for (const row of rows) {
    const cc = row.campaign_criterion;
    console.log(`  [${cc.criterion_id}] ${cc.keyword.text} (${cc.keyword.match_type})`);
  }
  console.log(`\n  Toplam: ${rows.length} kayit`);
}

async function cmdNegativeRemove(customer, campaignId, keywordsStr) {
  if (!campaignId || !keywordsStr) {
    console.error('Kullanim: negative:remove --campaign=XXX --keywords="kw1;kw2;kw3"');
    process.exit(1);
  }
  const toRemove = keywordsStr.split(';').map(k => k.trim().toLowerCase()).filter(Boolean);
  // First, find criterion IDs for these keywords
  const query = `
    SELECT campaign_criterion.criterion_id, campaign_criterion.keyword.text
    FROM campaign_criterion
    WHERE campaign.id = ${campaignId}
      AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
  `;
  const rows = await customer.query(query);
  let removed = 0;
  for (const row of rows) {
    const cc = row.campaign_criterion;
    if (toRemove.includes(cc.keyword.text.toLowerCase())) {
      try {
        await customer.campaignCriteria.remove([
          `customers/${CONFIG.customer_id}/campaignCriteria/${campaignId}~${cc.criterion_id}`
        ]);
        removed++;
        console.log(`  - "${cc.keyword.text}" kaldirildi (ID: ${cc.criterion_id})`);
      } catch (e) {
        console.error(`  x "${cc.keyword.text}": ${e.message}`);
      }
    }
  }
  console.log(`\n${removed}/${toRemove.length} negatif kelime kaldirildi.`);
}

async function cmdExtensionSitelinks(customer, campaignId) {
  if (!campaignId) {
    console.error('Kullanim: extension:sitelinks --campaign=XXX');
    process.exit(1);
  }

  // Create sitelink assets for the campaign
  const sitelinks = [
    { text: 'Hizmetlerimiz', description1: '7 uzmanlik alaninda hizmet', description2: 'Asi, gelisim takibi ve daha fazlasi', finalUrl: 'https://ozlemmurzoglu.com/hizmetlerimiz' },
    { text: 'Hakkimizda', description1: 'Dr. Ozlem Murzoglu', description2: 'Cocuk sagligi ve hastaliklari uzmani', finalUrl: 'https://ozlemmurzoglu.com/hakkimizda' },
    { text: 'Randevu Al', description1: 'Online randevu sistemi', description2: 'Hemen randevunuzu olusturun', finalUrl: 'https://ozlemmurzoglu.com/randevu' },
    { text: 'Iletisim', description1: 'Atasehir Uphill Towers', description2: 'Pzt-Cum 09:00-18:00', finalUrl: 'https://ozlemmurzoglu.com/iletisim' },
  ];

  for (const sl of sitelinks) {
    try {
      const assetResult = first(await customer.assets.create([{
        type: enums.AssetType.SITELINK,
        sitelink_asset: {
          link_text: sl.text,
          description1: sl.description1,
          description2: sl.description2,
        },
        final_urls: [sl.finalUrl],
      }]));

      // Link asset to campaign
      await customer.campaignAssets.create([{
        campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
        asset: assetResult,
        field_type: enums.AssetFieldType.SITELINK,
      }]);

      console.log(`  + Sitelink: "${sl.text}" -> ${sl.finalUrl}`);
    } catch (e) {
      console.error(`  x Sitelink "${sl.text}": ${e.message}`);
    }
  }
}

async function cmdExtensionCall(customer, campaignId) {
  if (!campaignId) {
    console.error('Kullanim: extension:call --campaign=XXX');
    process.exit(1);
  }

  try {
    const assetResult = first(await customer.assets.create([{
      type: enums.AssetType.CALL,
      call_asset: {
        country_code: 'TR',
        phone_number: '+902166884483',
        call_conversion_reporting_state: enums.CallConversionReportingState.USE_RESOURCE_LEVEL_CALL_CONVERSION_ACTION,
      },
    }]));

    await customer.campaignAssets.create([{
      campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
      asset: assetResult,
      field_type: enums.AssetFieldType.CALL,
    }]);

    console.log('  + Arama uzantisi: +90 216 688 44 83');
  } catch (e) {
    console.error(`  x Arama uzantisi: ${e.message}`);
  }
}

async function cmdExtensionCallouts(customer, campaignId) {
  if (!campaignId) {
    console.error('Kullanim: extension:callouts --campaign=XXX');
    process.exit(1);
  }

  const callouts = [
    'Bright Futures Sertifikali',
    '7 Uzmanlik Alani',
    'AAP Standartlari',
    'Pzt-Cum 09:00-18:00',
  ];

  for (const text of callouts) {
    try {
      const assetResult = first(await customer.assets.create([{
        type: enums.AssetType.CALLOUT,
        callout_asset: { callout_text: text },
      }]));

      await customer.campaignAssets.create([{
        campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
        asset: assetResult,
        field_type: enums.AssetFieldType.CALLOUT,
      }]);

      console.log(`  + Aciklama: "${text}"`);
    } catch (e) {
      console.error(`  x Aciklama "${text}": ${e.message}`);
    }
  }
}

// --- Asset (Image/Logo) Commands ---

const ASSET_FIELD_MAP = {
  'logo': enums.AssetFieldType.LOGO,
  'landscape-logo': enums.AssetFieldType.LANDSCAPE_LOGO,
  'marketing-image': enums.AssetFieldType.MARKETING_IMAGE,
  'square-marketing-image': enums.AssetFieldType.SQUARE_MARKETING_IMAGE,
  'business-logo': enums.AssetFieldType.BUSINESS_LOGO,
  'ad-image': enums.AssetFieldType.AD_IMAGE,
};

async function cmdAssetUpload(customer, filePath, name) {
  if (!filePath) {
    console.error('Kullanim: asset:upload --file=<dosya-yolu> [--name=<asset-adi>]');
    console.error('Ornek:  asset:upload --file=public/logos/OM-Square-Color.png --name="Kare Logo"');
    process.exit(1);
  }

  const fullPath = resolve(PROJECT_ROOT, filePath);
  if (!existsSync(fullPath)) {
    console.error(`Dosya bulunamadi: ${fullPath}`);
    process.exit(1);
  }

  const imageData = readFileSync(fullPath);
  const assetName = name || filePath.split('/').pop().replace(/\.[^.]+$/, '');

  console.log(`\n=== Gorsel Asset Yukleme ===`);
  console.log(`  Dosya: ${filePath}`);
  console.log(`  Boyut: ${(imageData.length / 1024).toFixed(1)} KB`);
  console.log(`  Ad:    ${assetName}`);

  try {
    const assetResult = first(await customer.assets.create([{
      type: enums.AssetType.IMAGE,
      name: assetName,
      image_asset: {
        data: imageData.toString('base64'),
      },
    }]));

    console.log(`  ✓ Asset yuklendi: ${assetResult}`);
    return assetResult;
  } catch (e) {
    console.error(`  ✗ Yukleme hatasi: ${e.errors?.[0]?.message || e.message}`);
    process.exit(1);
  }
}

async function cmdAssetList(customer) {
  const assets = await customer.query(`
    SELECT
      asset.id,
      asset.name,
      asset.type,
      asset.image_asset.file_size,
      asset.image_asset.full_size.width_pixels,
      asset.image_asset.full_size.height_pixels,
      asset.resource_name
    FROM asset
    WHERE asset.type = 'IMAGE'
    ORDER BY asset.id
  `);

  console.log('\n=== Gorsel Asset\'ler ===\n');
  if (assets.length === 0) {
    console.log('  (Henuz gorsel asset yok)');
    return;
  }

  table(
    assets.map(a => [
      a.asset.id,
      a.asset.name || '(isimsiz)',
      `${a.asset.image_asset?.full_size?.width_pixels || '?'}x${a.asset.image_asset?.full_size?.height_pixels || '?'}`,
      a.asset.image_asset?.file_size ? `${(a.asset.image_asset.file_size / 1024).toFixed(1)} KB` : '?',
      a.asset.resource_name,
    ]),
    ['ID', 'Ad', 'Boyut', 'Dosya', 'Resource']
  );
}

async function cmdAssetLink(customer, campaignId, assetId, fieldType) {
  if (!campaignId || !assetId || !fieldType) {
    console.error('Kullanim: asset:link --campaign=<ID> --asset=<ID> --type=<tur>');
    console.error('Turler: logo, landscape-logo, marketing-image, square-marketing-image, business-logo');
    process.exit(1);
  }

  const field = ASSET_FIELD_MAP[fieldType];
  if (!field) {
    console.error(`Gecersiz tur: "${fieldType}". Gecerli turler: ${Object.keys(ASSET_FIELD_MAP).join(', ')}`);
    process.exit(1);
  }

  try {
    await customer.campaignAssets.create([{
      campaign: `customers/${CONFIG.customer_id}/campaigns/${campaignId}`,
      asset: `customers/${CONFIG.customer_id}/assets/${assetId}`,
      field_type: field,
    }]);

    console.log(`  ✓ Asset #${assetId} -> Kampanya #${campaignId} (${fieldType})`);
  } catch (e) {
    console.error(`  ✗ Baglama hatasi: ${e.errors?.[0]?.message || e.message}`);
  }
}

async function cmdAssetUploadAndLink(customer, filePath, name, campaignId, fieldType) {
  const assetResource = await cmdAssetUpload(customer, filePath, name);

  if (campaignId && fieldType) {
    const assetId = assetResource.split('/').pop();
    await cmdAssetLink(customer, campaignId, assetId, fieldType);
  } else if (campaignId) {
    console.log('\n  (!) --type belirtilmedi, asset kampanyaya baglanmadi.');
    console.log('  Manuel baglamak icin: asset:link --campaign=... --asset=<ID> --type=logo');
  }
}

async function cmdSetupFull(customer, monthlyBudgetTL) {
  const budget = parseFloat(monthlyBudgetTL) || 5000;
  const dailyBudget = Math.round(budget / 30);

  console.log('\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
  console.log('\u2551  Google Ads Strateji Kurulumu                   \u2551');
  console.log('\u2551  Dr. Ozlem Murzoglu Klinigi                    \u2551');
  console.log('\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
  console.log(`\n  Aylik butce: ${budget} TL (gunluk ~${dailyBudget} TL)`);

  // --- STEP 1: Conversion Actions ---
  console.log('\n\u2501\u2501\u2501 1/6 Donusum Aksiyonlari \u2501\u2501\u2501');
  for (const [name, cat, val] of [['Telefon Aramasi','PHONE_CALL','150'],['WhatsApp Mesaji','OTHER','75'],['Form Gonderimi','SUBMIT_LEAD_FORM','100']]) {
    try { await cmdConversionCreate(customer, name, cat, val); }
    catch (e) { console.log(`  (!) ${name}: ${e.errors?.[0]?.message || e.message} — devam ediliyor`); }
  }

  // --- STEP 2: Campaigns ---
  console.log('\n\u2501\u2501\u2501 2/6 Kampanyalar \u2501\u2501\u2501');

  const dailyMain = Math.round(dailyBudget * 0.50);     // 50%
  const dailyPrograms = Math.round(dailyBudget * 0.25);  // 25%
  const dailyPmax = Math.round(dailyBudget * 0.25);      // 25%

  const campaign1 = await cmdCampaignCreate(customer, 'Ana Hizmet Aramalari', 'SEARCH', dailyMain, 'MAXIMIZE_CONVERSIONS');
  const campaign2 = await cmdCampaignCreate(customer, 'Ozel Programlar', 'SEARCH', dailyPrograms, 'MAXIMIZE_CONVERSIONS');
  const campaign3 = await cmdCampaignCreate(customer, 'PMax - Yerel Gorunum', 'PERFORMANCE_MAX', dailyPmax, 'MAXIMIZE_CONVERSIONS');

  // Extract campaign IDs from resource names
  const c1Id = campaign1.split('/').pop();
  const c2Id = campaign2.split('/').pop();
  const c3Id = campaign3.split('/').pop();

  // --- STEP 3: Ad Groups (Search campaigns only) ---
  console.log('\n\u2501\u2501\u2501 3/6 Reklam Gruplari \u2501\u2501\u2501');

  // Campaign 1 ad groups
  const ag1a = await cmdAdGroupCreate(customer, c1Id, 'Cocuk Doktoru', '5');
  const ag1b = await cmdAdGroupCreate(customer, c1Id, 'Bebek Yenidogan', '5');
  const ag1c = await cmdAdGroupCreate(customer, c1Id, 'Asi Takibi', '4');
  const ag1d = await cmdAdGroupCreate(customer, c1Id, 'Kontrol Muayene', '4');

  // Campaign 2 ad groups
  const ag2a = await cmdAdGroupCreate(customer, c2Id, 'Uyku Egitimi', '5');
  const ag2b = await cmdAdGroupCreate(customer, c2Id, 'Beslenme', '5');
  const ag2c = await cmdAdGroupCreate(customer, c2Id, 'Ebeveynlik', '4');

  // Extract ad group IDs
  const extractId = (resource) => resource.split('/').pop();

  // --- STEP 4: Keywords ---
  console.log('\n\u2501\u2501\u2501 4/6 Anahtar Kelimeler \u2501\u2501\u2501');

  // Campaign 1 keywords
  console.log('\n  [Cocuk Doktoru]');
  await cmdKeywordBulkAdd(customer, extractId(ag1a), 'atasehir cocuk doktoru;cocuk doktoru atasehir;kadikoy cocuk doktoru;umraniye cocuk doktoru;pediatrist atasehir;cocuk sagligi uzmani istanbul', 'PHRASE');

  console.log('\n  [Bebek Yenidogan]');
  await cmdKeywordBulkAdd(customer, extractId(ag1b), 'yenidogan doktoru atasehir;bebek doktoru istanbul anadolu yakasi;yenidogan muayenesi;bebek sagligi uzmani', 'PHRASE');

  console.log('\n  [Asi Takibi]');
  await cmdKeywordBulkAdd(customer, extractId(ag1c), 'cocuk asi takibi;bebek asisi atasehir;asi takvimi cocuk;cocuk asilama', 'PHRASE');

  console.log('\n  [Kontrol Muayene]');
  await cmdKeywordBulkAdd(customer, extractId(ag1d), 'cocuk saglik kontrolu;gelisim takibi istanbul;cocuk periyodik muayene;bebek kontrolu', 'PHRASE');

  // Campaign 2 keywords
  console.log('\n  [Uyku Egitimi]');
  await cmdKeywordBulkAdd(customer, extractId(ag2a), 'bebek uyku egitimi istanbul;cocuk uyku problemi;bebek uyumama;uyku egitimi uzmani', 'PHRASE');

  console.log('\n  [Beslenme]');
  await cmdKeywordBulkAdd(customer, extractId(ag2b), 'cocuk yemek yememe;secici yeme tedavisi;cocuk beslenme uzmani;sos feeding istanbul', 'PHRASE');

  console.log('\n  [Ebeveynlik]');
  await cmdKeywordBulkAdd(customer, extractId(ag2c), 'olumlu ebeveynlik programi;triple p istanbul;ebeveynlik egitimi;cocuk davranis yonetimi', 'PHRASE');

  // Negative keywords for both campaigns
  console.log('\n  [Negatif Kelimeler]');
  const negatives = 'ucretsiz;bedava;devlet hastanesi;acil;hastane;yetiskin;kadin dogum;dis;goz;is ilani;maas;staj;avrupa yakasi';
  await cmdNegativeAdd(customer, c1Id, negatives);
  await cmdNegativeAdd(customer, c2Id, negatives);

  // --- STEP 5: Ads ---
  console.log('\n\u2501\u2501\u2501 5/6 Reklamlar \u2501\u2501\u2501');

  // Campaign 1 main ad
  await cmdAdCreate(customer, extractId(ag1a),
    'Atasehir Cocuk Doktoru,Dr. Ozlem Murzoglu Klinigi,Hemen Randevu Alin,Bright Futures Sertifikali,Pzt-Cum 09:00-18:00,Uzman Pediatrist Atasehir,7 Farkli Uzmanlik Alani',
    'Uzm. Dr. Ozlem Murzoglu ile cocugunuzun sagligi guvende. Asi takibi gelisim kontrolu ve ozel programlar. Atasehir Uphill Towers.,AAP standartlarinda Bright Futures gelisim takibi. 7 farkli uzmanlik alaninda hizmet. Online randevu alin.',
    'https://ozlemmurzoglu.com'
  );

  // Campaign 2 sleep ad
  await cmdAdCreate(customer, extractId(ag2a),
    'Bebek Uyku Egitimi Istanbul,Saglikli Uykular Programi,Kisisel Uyku Plani,Sertifikali Uzman Destegi,2 Hafta Yogun Takip',
    'Bebeginiz uyumakta zorlaniyor mu? Saglikli Uykular programi ile kisisel uyku plani ve 2 hafta yogun takip.,Dr. Ozlem Murzoglu ile bilimsel yontemlerle bebek uyku egitimi. WhatsApp destek hatti dahil.',
    'https://ozlemmurzoglu.com/hizmetlerimiz/saglikli-uykular'
  );

  // Campaign 2 feeding ad
  await cmdAdCreate(customer, extractId(ag2b),
    'Cocuk Yemek Yememe Tedavisi,SOS Feeding Programi,Duyusal Entegrasyon Yaklasimi,Oyun Temelli Terapi,Uluslararasi Sertifikali',
    'Cocugunuz yemek yemiyor mu? SOS Feeding ile duyusal entegrasyon yaklasimi ve oyun temelli beslenme terapisi.,Secici yeme davranisi tedavisinde bilimsel yontemler. Aile merkezli terapi ile kalici cozumler.',
    'https://ozlemmurzoglu.com/hizmetlerimiz/sos-feeding'
  );

  // --- STEP 6: Extensions ---
  console.log('\n\u2501\u2501\u2501 6/6 Uzantilar \u2501\u2501\u2501');

  console.log('\n  [Sitelink Uzantilari - Kampanya 1]');
  await cmdExtensionSitelinks(customer, c1Id);

  console.log('\n  [Sitelink Uzantilari - Kampanya 2]');
  await cmdExtensionSitelinks(customer, c2Id);

  console.log('\n  [Arama Uzantisi]');
  await cmdExtensionCall(customer, c1Id);
  await cmdExtensionCall(customer, c2Id);

  console.log('\n  [Aciklama Uzantilari]');
  await cmdExtensionCallouts(customer, c1Id);
  await cmdExtensionCallouts(customer, c2Id);

  // --- DONE ---
  console.log('\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
  console.log('\u2551  Kurulum Tamamlandi!                            \u2551');
  console.log('\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
  console.log('\u2551  3 Donusum aksiyonu olusturuldu                \u2551');
  console.log('\u2551  3 Kampanya olusturuldu (PAUSED durumda)       \u2551');
  console.log('\u2551  7 Reklam grubu olusturuldu                    \u2551');
  console.log('\u2551  ~40 Anahtar kelime eklendi                    \u2551');
  console.log('\u2551  ~13 Negatif kelime eklendi                    \u2551');
  console.log('\u2551  3+ Reklam olusturuldu                         \u2551');
  console.log('\u2551  Sitelink + Arama + Aciklama uzantilari eklendi\u2551');
  console.log('\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
  console.log('\u2551                                                  \u2551');
  console.log('\u2551  Kampanyalar PAUSED durumda baslatildi.         \u2551');
  console.log('\u2551  Etkinlestirmek icin:                           \u2551');
  console.log('\u2551  ads-manager.mjs campaign:enable --id=XXXXX     \u2551');
  console.log('\u2551                                                  \u2551');
  console.log('\u2551  Platform tarafinda yapilmasi gerekenler:       \u2551');
  console.log('\u2551  1. Google Ads > Linked accounts > GA4 baglanti \u2551');
  console.log('\u2551  2. Google Ads > Linked accounts > GBP baglanti \u2551');
  console.log('\u2551  3. Cografi hedefleme ayarlari                  \u2551');
  console.log('\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
}

function showHelp() {
  console.log(`
=== Google Ads CLI Manager ===
Uzm.Dr. Ozlem Murzoglu Klinigi

Kullanim:
  node scripts/google-ads/ads-manager.mjs <komut> [secenekler]

Raporlama:
  account                          Hesap bilgileri
  campaigns                        Kampanyalari listele
  campaign:details --id=XXX        Kampanya detaylari
  adgroups [--campaign=XXX]        Reklam gruplarini listele
  ads [--campaign=XXX]             Reklamlari listele
  keywords [--campaign=XXX]        Anahtar kelimeleri listele
  budget                           Butceleri listele
  metrics [--days=30]              Performans metrikleri
  search-terms [--campaign=XXX] [--days=30]
  conversions                      Donusum aksiyonlarini listele

Yonetim:
  campaign:enable  --id=XXX        Kampanyayi etkinlestir
  campaign:pause   --id=XXX        Kampanyayi duraklat
  budget:update --id=XXX --amount=50
  keyword:add --adgroup=XXX --keyword="..." [--match=EXACT|PHRASE|BROAD]
  keyword:remove --id=XXX --adgroup=XXX

Olusturma:
  campaign:create --name="..." --budget=50 [--channel=SEARCH|PERFORMANCE_MAX] [--bidding=MAXIMIZE_CONVERSIONS|TARGET_CPA]
  adgroup:create --campaign=XXX --name="..." [--cpc=5]
  ad:create --adgroup=XXX --headlines="H1,H2,H3" --descriptions="D1,D2" [--url=https://...]
  keyword:bulk-add --adgroup=XXX --keywords="kw1;kw2;kw3" [--match=EXACT|PHRASE|BROAD]
  negative:add --campaign=XXX --keywords="kw1;kw2;kw3"
  conversion:create --name="..." --category=PHONE_CALL|SUBMIT_LEAD_FORM|OTHER --value=100

Uzantilar:
  extension:sitelinks --campaign=XXX   Sitelink uzantilari ekle
  extension:call --campaign=XXX        Arama uzantisi ekle
  extension:callouts --campaign=XXX    Aciklama uzantilari ekle

Gorsel Asset'ler:
  asset:upload --file=<yol> [--name=<ad>] [--campaign=XXX --type=<tur>]
                                     Gorsel yukle (opsiyonel: kampanyaya bagla)
  asset:list                         Yuklenmis gorsel asset'leri listele
  asset:link --campaign=XXX --asset=XXX --type=<tur>
                                     Asset'i kampanyaya bagla
  Turler: logo, landscape-logo, marketing-image, square-marketing-image,
          business-logo, ad-image

Tam Kurulum:
  setup:full [--budget=5000]       Tam strateji kurulumu (3 kampanya, reklam gruplari,
                                   anahtar kelimeler, reklamlar, uzantilar - hepsi birden)

  help                             Bu yardim mesaji

Ornekler:
  ads-manager.mjs campaigns
  ads-manager.mjs metrics --days=7
  ads-manager.mjs keyword:add --adgroup=123 --keyword="pediatri istanbul" --match=PHRASE
  ads-manager.mjs budget:update --id=456 --amount=75
  ads-manager.mjs search-terms --days=14
  ads-manager.mjs campaign:create --name="Yeni Kampanya" --budget=100 --channel=SEARCH
  ads-manager.mjs keyword:bulk-add --adgroup=123 --keywords="cocuk doktoru;pediatrist" --match=PHRASE
  ads-manager.mjs setup:full --budget=5000
  ads-manager.mjs asset:upload --file=public/logos/OM-Square-Color.png --name="Kare Logo"
  ads-manager.mjs asset:link --campaign=123 --asset=456 --type=ad-image
  ads-manager.mjs asset:list
`);
}

// --- Argument parser ---
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const opts = {};

  const restArgs = args.slice(1);
  for (let i = 0; i < restArgs.length; i++) {
    const arg = restArgs[i];
    const match = arg.match(/^--(\w[\w-]*)(?:=(.+))?$/);
    if (match) {
      if (match[2] !== undefined) {
        opts[match[1]] = match[2];
      } else if (i + 1 < restArgs.length && !restArgs[i + 1].startsWith('--')) {
        opts[match[1]] = restArgs[++i];
      } else {
        opts[match[1]] = true;
      }
    }
  }

  return { command, opts };
}

// --- Test Account Management ---

async function cmdCreateTestAccount(manager) {
  console.log('\n=== Test Hesabi Olusturuluyor ===');
  console.log('  Manager hesabi: ' + CONFIG.login_customer_id);

  try {
    const result = await manager.customerClients.create([{
      customer_client: {
        descriptive_name: 'Dr. Murzoglu - Test Hesabi',
        currency_code: 'TRY',
        time_zone: 'Europe/Istanbul',
      },
    }]);

    const testId = result[0].split('/').pop();
    console.log(`\n  Test hesabi olusturuldu!`);
    console.log(`  Test Hesap ID: ${testId}`);
    console.log(`\n  Kullanim:`);
    console.log(`  node ads-manager.mjs setup:full --budget=5000 --test=${testId}`);
    return testId;
  } catch (e) {
    // customerClients.create may not be available, try alternative
    console.error('  API ile test hesabi olusturulamadi:', e.message);
    console.log('\n  Manuel olusturma adimlari:');
    console.log('  1. https://ads.google.com adresine gidin');
    console.log('  2. Manager hesabiniza (7672524542) girin');
    console.log('  3. Ayarlar > Alt hesap ayarlari > Test hesabi olustur');
    console.log('  4. Para birimi: TRY, Zaman dilimi: Istanbul secin');
    console.log('  5. Olusturulan test hesap ID\'sini kopyalayin');
    console.log('  6. Calistirin: node ads-manager.mjs setup:full --budget=5000 --test=TEST_HESAP_ID');
  }
}

// --- Main ---
async function main() {
  const { command, opts } = parseArgs();

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  // Test account creation uses manager client
  if (command === 'test:create') {
    const manager = getManagerClient();
    await cmdCreateTestAccount(manager);
    return;
  }

  // Use test account if --test flag is provided
  const targetCustomerId = opts.test || CONFIG.customer_id;
  if (opts.test) {
    console.log(`\n  [TEST MODU] Hedef hesap: ${opts.test}\n`);
  }
  const customer = getClient(targetCustomerId);

  try {
    switch (command) {
      case 'account':
        await cmdAccount(customer);
        break;
      case 'campaigns':
        await cmdCampaigns(customer);
        break;
      case 'campaign:details':
        await cmdCampaignDetails(customer, opts.id);
        break;
      case 'campaign:enable':
        await cmdCampaignSetStatus(customer, opts.id, 'ENABLED');
        break;
      case 'campaign:pause':
        await cmdCampaignSetStatus(customer, opts.id, 'PAUSED');
        break;
      case 'campaign:set-bidding':
        await cmdCampaignSetBidding(customer, opts.id, opts.strategy, opts['max-cpc']);
        break;
      case 'campaign:remove':
        await cmdCampaignRemove(customer, opts.id);
        break;
      case 'adgroups':
        await cmdAdGroups(customer, opts.campaign);
        break;
      case 'ads':
        await cmdAds(customer, opts.campaign);
        break;
      case 'keywords':
        await cmdKeywords(customer, opts.campaign);
        break;
      case 'keyword:add':
        await cmdKeywordAdd(customer, opts.adgroup, opts.keyword, opts.match);
        break;
      case 'keyword:remove':
        await cmdKeywordRemove(customer, opts.id, opts.adgroup);
        break;
      case 'budget':
        await cmdBudget(customer);
        break;
      case 'budget:update':
        await cmdBudgetUpdate(customer, opts.id, opts.amount);
        break;
      case 'budget:remove':
        await cmdBudgetRemove(customer, opts.id);
        break;
      case 'metrics':
        await cmdMetrics(customer, parseInt(opts.days) || 30);
        break;
      case 'search-terms':
        await cmdSearchTerms(customer, opts.campaign, parseInt(opts.days) || 30);
        break;
      case 'conversion:create':
        await cmdConversionCreate(customer, opts.name, opts.category, opts.value);
        break;
      case 'conversions':
        await cmdConversionList(customer);
        break;
      case 'campaign:create':
        await cmdCampaignCreate(customer, opts.name, opts.channel || 'SEARCH', opts.budget, opts.bidding || 'MAXIMIZE_CONVERSIONS');
        break;
      case 'assetgroup:create':
        await cmdAssetGroupCreate(customer, opts.campaign, opts.name, opts.url);
        break;
      case 'adgroup:create':
        await cmdAdGroupCreate(customer, opts.campaign, opts.name, opts.cpc);
        break;
      case 'ad:create':
        await cmdAdCreate(customer, opts.adgroup, opts.headlines, opts.descriptions, opts.url);
        break;
      case 'keyword:bulk-add':
        await cmdKeywordBulkAdd(customer, opts.adgroup, opts.keywords, opts.match);
        break;
      case 'negative:add':
        await cmdNegativeAdd(customer, opts.campaign, opts.keywords);
        break;
      case 'negative:list':
        await cmdNegativeList(customer, opts.campaign);
        break;
      case 'negative:remove':
        await cmdNegativeRemove(customer, opts.campaign, opts.keywords);
        break;
      case 'extension:sitelinks':
        await cmdExtensionSitelinks(customer, opts.campaign);
        break;
      case 'extension:call':
        await cmdExtensionCall(customer, opts.campaign);
        break;
      case 'extension:callouts':
        await cmdExtensionCallouts(customer, opts.campaign);
        break;
      case 'asset:upload':
        await cmdAssetUploadAndLink(customer, opts.file, opts.name, opts.campaign, opts.type);
        break;
      case 'asset:list':
        await cmdAssetList(customer);
        break;
      case 'asset:link':
        await cmdAssetLink(customer, opts.campaign, opts.asset, opts.type);
        break;
      case 'setup:full':
        await cmdSetupFull(customer, opts.budget);
        break;
      default:
        console.error(`Bilinmeyen komut: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    if (err.errors) {
      // Google Ads API error
      for (const e of err.errors) {
        console.error(`\nAPI Hatasi: ${e.message}`);
        if (e.error_code) console.error('  Kod:', JSON.stringify(e.error_code));
      }
    } else {
      console.error('\nHata:', err.message);
    }
    process.exit(1);
  }
}

main();
