import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_SOURCE_PATH = path.join(__dirname, '../documents');
const PUBLIC_DOCUMENTS_PATH = path.join(__dirname, '../public/documents');
const OUTPUT_PATH = path.join(__dirname, '../src/app/pages/resources');
const ASSETS_RESOURCES_PATH = path.join(__dirname, '../src/assets/resources');
const ASSETS_DOCS_PATH = path.join(ASSETS_RESOURCES_PATH, 'docs');
const INDEX_JSON_PATH = path.join(ASSETS_RESOURCES_PATH, 'resources-index.json');

const CATEGORY_MAPPING = {
  'Bright Futures (Aile)': 'bright-futures-aile',
  'Bright Futures (Çocuk)': 'bright-futures-cocuk',
  'Aşılar': 'asilar',
  'Gebelik Dönemi': 'gebelik-donemi',
  'Gelişim Rehberleri': 'gelisim-rehberleri',
  'Hastalıklar': 'hastaliklar',
  'Oyuncaklar': 'oyuncaklar',
  'Aile Medya Planı': 'aile-medya-plani',
  'Genel Bilgiler': 'genel-bilgiler',
  'CDC Büyüme Eğrileri': 'cdc-buyume-egrileri',
  'WHO Büyüme Eğrileri': 'who-buyume-egrileri'
};

const CATEGORY_TITLES = Object.fromEntries(
  Object.entries(CATEGORY_MAPPING).map(([title, slug]) => [slug, title])
);

function toPascalCaseFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function cleanComponentName(fileName) {
  return fileName
    .replace(/\.docx$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanClassName(fileName, baseSlugOverride) {
  const baseSlug = baseSlugOverride || cleanComponentName(fileName);
  let cleaned = toPascalCaseFromSlug(baseSlug);
  if (/^\d/.test(cleaned)) {
    cleaned = 'Doc' + cleaned;
  }
  return cleaned + 'Component';
}

async function syncDocuments() {
  await fs.mkdir(PUBLIC_DOCUMENTS_PATH, { recursive: true });
  await fs.cp(DOCUMENTS_SOURCE_PATH, PUBLIC_DOCUMENTS_PATH, { recursive: true, force: true });
}

async function processDocxFile(filePath) {
  try {
    const htmlResult = await mammoth.convertToHtml({
      path: filePath,
      convertImage: mammoth.images.imgElement(function() {
        return { src: '' };
      })
    });
    return htmlResult.value;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

function normalizeText(input) {
  return input
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2026]/g, '...')
    .replace(/[\u00A0]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
}

function processHtmlForMD3(html) {
  let processed = html
    .replace(/<o:p><\/o:p>/g, '')
    .replace(/<o:p>&nbsp;<\/o:p>/g, '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/<img[^>]*>/g, '')
    .replace(/<br\/?\s*>/g, '<br>')
    .replace(/&nbsp;/g, ' ');

  processed = normalizeText(processed);
  processed = processed.replace(/\n{2,}/g, '\n');

  return processed.trim();
}

function summarizeTextFromHtml(html) {
  const txt = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const max = 180;
  return txt.length > max ? txt.slice(0, max - 3) + '...' : txt;
}

function getCategoryTitle(category) {
  return CATEGORY_TITLES[category] || category;
}

async function writeDocAsset(category, componentName, payload) {
  const docDir = path.join(ASSETS_DOCS_PATH, category);
  await fs.mkdir(docDir, { recursive: true });
  const docPath = path.join(docDir, `${componentName}.json`);
  await fs.writeFile(docPath, JSON.stringify(payload, null, 2), 'utf8');
}

async function createComponentFiles(category, folderName, fileName, htmlContent, usedNames) {
  let componentName = cleanComponentName(fileName);
  let className = cleanClassName(fileName, componentName);

  if (usedNames.component.has(`${category}/${componentName}`)) {
    let i = 2;
    while (usedNames.component.has(`${category}/${componentName}-v${i}`)) i++;
    componentName = `${componentName}-v${i}`;
    className = cleanClassName(fileName, componentName);
  }
  usedNames.component.add(`${category}/${componentName}`);
  if (usedNames.class.has(className)) {
    let i = 2;
    let newClass = className.replace(/Component$/, `V${i}Component`);
    while (usedNames.class.has(newClass)) {
      i++;
      newClass = className.replace(/Component$/, `V${i}Component`);
    }
    className = newClass;
  }
  usedNames.class.add(className);

  const categoryPath = path.join(OUTPUT_PATH, category);
  await fs.mkdir(categoryPath, { recursive: true });

  const componentPath = path.join(categoryPath, componentName);
  await fs.mkdir(componentPath, { recursive: true });

  const processedHtml = processHtmlForMD3(htmlContent);
  const description = summarizeTextFromHtml(processedHtml);
  const title = fileName.replace(/\.docx$/i, '');
  const downloadUrl = `/documents/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
  const docAssetPath = `/assets/resources/docs/${category}/${componentName}.json`;

  await writeDocAsset(category, componentName, {
    title,
    description,
    category,
    categoryTitle: getCategoryTitle(category),
    contentHtml: processedHtml,
    downloadUrl
  });

  const tsContent = `import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageHeaderComponent, Breadcrumb } from '../../../../components/page-header/page-header.component';
import { ContactCtaComponent } from '../../../../components/contact-cta/contact-cta.component';

interface ResourceDocPayload {
  title: string;
  description: string;
  category: string;
  categoryTitle: string;
  contentHtml: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './${componentName}.component.html',
  styleUrls: ['../../resource-enhanced-styles.scss']
})
export class ${className} implements OnInit, AfterViewInit {
  docAssetPath = '${docAssetPath}';
  resource: ResourceDocPayload | null = null;
  contentHtml: SafeHtml | null = null;
  breadcrumbs: Breadcrumb[] = [];
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private meta: Meta,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.http.get<ResourceDocPayload>(this.docAssetPath).subscribe({
      next: (doc) => {
        this.resource = doc;
        this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(doc.contentHtml);
        this.breadcrumbs = this.buildBreadcrumbs(doc);
        const resourcesLabel = this.translate.instant('RESOURCES.SECTION_TITLE');
        const siteLabel = this.translate.instant('COMMON.DOCTOR_NAME');
        const fullTitle = doc.title + ' | ' + resourcesLabel + ' | ' + siteLabel;
        this.titleService.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: doc.description });
        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        this.meta.updateTag({ property: 'og:description', content: doc.description });
        setTimeout(() => this.buildToc(), 0);
      },
      error: (err) => console.error('Failed to load resource document', err)
    });
  }

  ngAfterViewInit(): void {
    if (this.resource) {
      this.buildToc();
    }
  }

  private buildBreadcrumbs(doc: ResourceDocPayload): Breadcrumb[] {
    return [
      { translateKey: 'RESOURCES.HOME_BREADCRUMB', url: '/' },
      { translateKey: 'RESOURCES.RESOURCES_BREADCRUMB', url: '/kaynaklar' },
      { label: doc.categoryTitle, url: '/kaynaklar/' + doc.category },
      { label: doc.title }
    ];
  }

  private buildToc(): void {
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.tocIds.clear();
    this.toc = headings.map(h => {
      const text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      const base = id;
      let i = 2;
      while (this.tocIds.has(id) || document.getElementById(id)) {
        id = base + '-' + (i++);
      }
      this.tocIds.add(id);
      h.setAttribute('id', id);
      return { id, text, level };
    });
  }

  private slugify(text: string): string {
    const normalized = text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u');
    return normalized
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  printPage(): void {
    window.print();
  }

  sharePage(): void {
    if (!this.resource) return;
    const data = {
      title: this.resource.title,
      text: this.resource.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(data).catch(console.error);
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(console.error);
    }
  }
}
`;

  const htmlTemplate = `<app-page-header
  [title]="resource?.title || ''"
  [subtitle]="resource?.description || ''"
  [breadcrumbs]="breadcrumbs">
</app-page-header>

<main class="resource-page">
  <section class="resource-content">
    <div class="container">
      <div class="resource-layout">
        <aside class="toc-sidebar" *ngIf="toc.length">
          <div class="toc-header">
            <span class="material-icons-rounded" aria-hidden="true">list</span>
            <h3>{{ 'RESOURCES.TABLE_OF_CONTENTS' | translate }}</h3>
          </div>
          <nav class="toc-nav">
            <a *ngFor="let item of toc" class="toc-link" [attr.href]="'#' + item.id" [ngClass]="{ 'level-3': item.level === 3 }">
              <span class="dot" aria-hidden="true"></span>
              <span class="label">{{ item.text }}</span>
            </a>
          </nav>
        </aside>

        <article class="content-card">
          <div class="content-body" #contentRoot [innerHTML]="contentHtml"></div>
        </article>
      </div>

      <div class="action-bar">
        <div class="action-group">
          <button class="action-btn btn-secondary" type="button" (click)="printPage()">
            <span class="material-icons-rounded" aria-hidden="true">print</span>
            <span>{{ 'COMMON.PRINT' | translate }}</span>
          </button>
          <button class="action-btn btn-secondary" type="button" (click)="sharePage()">
            <span class="material-icons-rounded" aria-hidden="true">share</span>
            <span>{{ 'COMMON.SHARE' | translate }}</span>
          </button>
        </div>
        <a *ngIf="resource?.downloadUrl"
           [href]="resource?.downloadUrl"
           download
           class="action-btn btn-primary">
          <span class="material-icons-rounded" aria-hidden="true">download</span>
          <span>{{ 'RESOURCES.DOWNLOAD_ORIGINAL' | translate }}</span>
        </a>
      </div>
    </div>
  </section>
</main>

<app-contact-cta></app-contact-cta>
`;

  await fs.writeFile(path.join(componentPath, `${componentName}.component.ts`), tsContent);
  await fs.writeFile(path.join(componentPath, `${componentName}.component.html`), htmlTemplate);
  await fs.writeFile(
    path.join(componentPath, `${componentName}.component.css`),
    '/* Shared styles from src/app/pages/resources/resource-enhanced-styles.scss */\n'
  );

  return { componentName, className, category, title, description, downloadUrl };
}

async function createRoutingFile(routes) {
  const routeDefinitions = [
    ...Object.values(CATEGORY_MAPPING).map((categorySlug) => {
      const className = categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('') + 'CategoryComponent';
      const importPath = `./${categorySlug}/index.component`;
      return `  { path: 'kaynaklar/${categorySlug}', loadComponent: () => import('${importPath}').then(m => m.${className}) }`;
    }),
    ...routes.map((r) => `  { path: '${r.path}', loadComponent: () => import('${r.import}').then(m => m.${r.className}) }`),
  ].join(',\n');

  const content = `// Auto-generated resource routes (lazy-loaded)\nimport { Routes } from '@angular/router';\n\nexport const resourceRoutes: Routes = [\n${routeDefinitions}\n];\n`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'resource-routes.ts'), content);
}

async function createCategoryPages() {
  const indexPath = '/assets/resources/resources-index.json';

  for (const [folderName, categorySlug] of Object.entries(CATEGORY_MAPPING)) {
    const categoryPath = path.join(OUTPUT_PATH, categorySlug);
    await fs.mkdir(categoryPath, { recursive: true });

    const className = categorySlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') + 'CategoryComponent';

    const indexContent = `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { PageHeaderComponent, Breadcrumb } from '../../../components/page-header/page-header.component';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';

interface ResourceDoc {
  slug: string;
  title: string;
  description: string;
  path: string;
  downloadUrl: string;
}

interface ResourceIndex {
  categories: Record<string, { title: string; documents: ResourceDoc[] }>;
}

@Component({
  selector: 'app-${categorySlug}',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './index.component.html',
  styleUrls: ['../resource-enhanced-styles.scss']
})
export class ${className} implements OnInit {
  categorySlug = '${categorySlug}';
  categoryTitle = '';
  docs: ResourceDoc[] = [];
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.http.get<ResourceIndex>('${indexPath}').subscribe({
      next: (index) => {
        const category = index.categories[this.categorySlug];
        this.categoryTitle = category?.title || '${folderName}';
        this.docs = category?.documents || [];
        this.breadcrumbs = [
          { translateKey: 'RESOURCES.HOME_BREADCRUMB', url: '/' },
          { translateKey: 'RESOURCES.RESOURCES_BREADCRUMB', url: '/kaynaklar' },
          { label: this.categoryTitle }
        ];
        const resourcesLabel = this.translate.instant('RESOURCES.SECTION_TITLE');
        const siteLabel = this.translate.instant('COMMON.DOCTOR_NAME');
        const fullTitle = this.categoryTitle + ' | ' + resourcesLabel + ' | ' + siteLabel;
        this.title.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: this.translate.instant('RESOURCES.CATEGORY_SUBTITLE') });
      },
      error: (err) => console.error('Failed to load resources index', err)
    });
  }
}
`;

    const htmlContent = `<app-page-header
  [title]="categoryTitle"
  [subtitle]="'RESOURCES.CATEGORY_SUBTITLE' | translate"
  [breadcrumbs]="breadcrumbs">
</app-page-header>

<main class="resource-page">
  <section class="resource-content">
    <div class="container">
      <div class="resource-grid">
        <a *ngFor="let doc of docs" class="resource-card" [routerLink]="doc.path">
          <div class="resource-card-icon">
            <span class="material-icons-rounded" aria-hidden="true">description</span>
          </div>
          <div class="resource-card-body">
            <h3>{{ doc.title }}</h3>
            <p *ngIf="doc.description">{{ doc.description }}</p>
          </div>
          <span class="material-icons-rounded" aria-hidden="true">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>
</main>

<app-contact-cta></app-contact-cta>
`;

    await fs.writeFile(path.join(categoryPath, 'index.component.ts'), indexContent);
    await fs.writeFile(path.join(categoryPath, 'index.component.html'), htmlContent);
    await fs.writeFile(
      path.join(categoryPath, 'index.component.css'),
      '/* Shared styles from src/app/pages/resources/resource-enhanced-styles.scss */\n'
    );
  }
}

async function createResourcesIndex(indexMap) {
  const categories = {};
  for (const [cat, items] of indexMap.entries()) {
    const sorted = items.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
    categories[cat] = {
      title: getCategoryTitle(cat),
      documents: sorted.map((item) => ({
        slug: item.slug,
        title: item.title,
        description: item.description,
        path: item.path,
        downloadUrl: item.downloadUrl
      }))
    };
  }

  await fs.mkdir(ASSETS_RESOURCES_PATH, { recursive: true });
  await fs.writeFile(INDEX_JSON_PATH, JSON.stringify({ categories }, null, 2), 'utf8');

  const tsContent = `export interface ResourceDoc {\n  slug: string;\n  title: string;\n  description: string;\n  path: string;\n  downloadUrl: string;\n}\n\nexport interface ResourceIndex {\n  categories: Record<string, { title: string; documents: ResourceDoc[] }>;\n}\n`;
  await fs.writeFile(path.join(OUTPUT_PATH, 'resources-index.ts'), tsContent);
}

async function createSitemap(indexMap) {
  try {
    const baseUrl = process.env.SITEMAP_BASE_URL || '';
    const today = new Date().toISOString().split('T')[0];
    const urls = new Set([
      '/', '/hakkimizda', '/hizmetlerimiz', '/blog', '/sss', '/saygiyla', '/iletisim', '/kaynaklar',
      ...Object.values(CATEGORY_MAPPING).map(slug => `/kaynaklar/${slug}`)
    ]);
    for (const items of indexMap.values()) {
      for (const item of items) urls.add(item.path);
    }
    const urlset = Array.from(urls).map(u => `  <url>\n    <loc>${baseUrl}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u === '/' ? '1.0' : u.startsWith('/kaynaklar') ? '0.8' : '0.6'}</priority>\n  </url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
    const outPath = path.join(__dirname, '../public/sitemap.xml');
    await fs.writeFile(outPath, xml, 'utf8');
    console.log('sitemap.xml generated at public/sitemap.xml');
  } catch (e) {
    console.error('Failed to generate sitemap.xml', e);
  }
}

async function updateRobotsWithSitemap() {
  try {
    const baseUrl = process.env.SITEMAP_BASE_URL || '';
    if (!baseUrl) return;
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    let content = '';
    try { content = await fs.readFile(robotsPath, 'utf8'); } catch {}
    const sitemapLine = `Sitemap: ${baseUrl}/sitemap.xml`;
    if (!content.includes(sitemapLine)) {
      content = (content ? content.trim() + '\n' : '') + sitemapLine + '\n';
      await fs.writeFile(robotsPath, content, 'utf8');
      console.log('robots.txt updated with sitemap reference');
    }
  } catch (e) {
    console.error('Failed to update robots.txt', e);
  }
}

async function processAllDocuments() {
  console.log('Starting full document processing...\n');

  await syncDocuments();

  const allComponents = [];
  const routeEntries = [];
  const usedNames = { component: new Set(), class: new Set() };
  const indexMap = new Map();

  for (const [folderName, categorySlug] of Object.entries(CATEGORY_MAPPING)) {
    const folderPath = path.join(DOCUMENTS_SOURCE_PATH, folderName);

    try {
      const files = await fs.readdir(folderPath);
      const docxFiles = files.filter(f => f.endsWith('.docx'));

      console.log(`\nProcessing ${folderName} (${docxFiles.length} files)...`);

      for (const file of docxFiles) {
        const filePath = path.join(folderPath, file);
        const htmlContent = await processDocxFile(filePath);

        if (htmlContent) {
          const component = await createComponentFiles(categorySlug, folderName, file, htmlContent, usedNames);
          allComponents.push(component);

          const routePath = `kaynaklar/${categorySlug}/${component.componentName}`;
          routeEntries.push({
            path: routePath,
            import: `./${categorySlug}/${component.componentName}/${component.componentName}.component`,
            className: component.className
          });

          const title = file.replace(/\.docx$/i, '');
          if (!indexMap.has(categorySlug)) indexMap.set(categorySlug, []);
          indexMap.get(categorySlug).push({
            slug: component.componentName,
            title,
            description: component.description,
            path: `/${routePath}`,
            downloadUrl: component.downloadUrl
          });

          console.log(`  Processed ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error processing folder ${folderName}:`, error);
    }
  }

  await createRoutingFile(routeEntries);
  await createResourcesIndex(indexMap);
  await createCategoryPages();
  await createSitemap(indexMap);
  await updateRobotsWithSitemap();

  console.log(`\nProcessing complete.`);
  console.log(`Created ${allComponents.length} components.`);
  console.log(`Processed ${Object.keys(CATEGORY_MAPPING).length} categories.`);
}

processAllDocuments().catch(console.error);
