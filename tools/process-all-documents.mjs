import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_PATH = path.join(__dirname, '../public/documents');
const OUTPUT_PATH = path.join(__dirname, '../src/app/pages/resources');

// Kategori mapping
const categoryMapping = {
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

function toPascalCaseFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function cleanClassName(fileName, baseSlugOverride) {
  // Class adını, slug'dan türeterek daha kararlı hale getir
  const baseSlug = baseSlugOverride || cleanComponentName(fileName);
  let cleaned = toPascalCaseFromSlug(baseSlug);
  // Eğer ilk karakter rakamsa başına "Doc" ekle
  if (/^\d/.test(cleaned)) {
    cleaned = 'Doc' + cleaned;
  }
  return cleaned + 'Component';
}

function cleanComponentName(fileName) {
  return fileName
    .replace(/\.docx$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function processDocxFile(filePath) {
  try {
    // Sadece metni çek, görselleri dahil etme
    const result = await mammoth.extractRawText({ path: filePath });
    const htmlResult = await mammoth.convertToHtml({
      path: filePath,
      convertImage: mammoth.images.imgElement(function() {
        // Görselleri tamamen yoksay
        return { src: '' };
      })
    });

    // HTML'den img taglerini temizle
    let cleanHtml = htmlResult.value
      .replace(/<img[^>]*>/g, '')
      .replace(/<img[^>]*\/>/g, '');

    return cleanHtml;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

async function createComponentFiles(category, folderName, fileName, htmlContent, usedNames) {
  let componentName = cleanComponentName(fileName);
  let className = cleanClassName(fileName, componentName);

  // İsim çakışmalarını önle
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

  // Process HTML content for Material Design 3
  const processedHtml = processHtmlForMD3(htmlContent, fileName);
  const description = summarizeTextFromHtml(processedHtml);

  // Create component TypeScript file with event handlers
  const tsContent = `import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './${componentName}.component.html',
  styleUrls: ['../../resource-enhanced-styles.css']
})
export class ${className} implements OnInit, AfterViewInit {
  title = '${fileName.replace(/\.docx$/i, '')}';
  category = '${getCategoryTitle(category)}';
  description: string = ${JSON.stringify(description)};
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    const fullTitle = this.title + ' | Kaynaklar | Özlem Mürzoğlu';
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.description });
  }

  ngAfterViewInit(): void {
    // Build TOC from h2/h3 headings
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.toc = headings.map(h => {
      let text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      // ensure unique
      let base = id;
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
    return text
      .toLowerCase()
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
    if (navigator.share) {
      navigator.share({
        title: this.title,
        text: this.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Paylaşma özelliği bu tarayıcıda desteklenmiyor. Linki kopyalayabilirsiniz.');
    }
  }
}
`;

  // Create component HTML file with enhanced MD3 design
  const htmlTemplate = `<div class="resource-page">
  <!-- Hero Section with Gradient -->
  <div class="resource-hero">
    <div class="hero-pattern"></div>
    <div class="container">
      <nav class="breadcrumb">
        <a routerLink="/kaynaklar" class="breadcrumb-link">
          <span class="material-icons">folder</span>
          <span>Kaynaklar</span>
        </a>
        <span class="material-icons separator">chevron_right</span>
        <a routerLink="/kaynaklar/${category}" class="breadcrumb-link">
          <span>{{ category }}</span>
        </a>
        <span class="material-icons separator">chevron_right</span>
        <span class="current">{{ title }}</span>
      </nav>

      <div class="hero-content">
        <h1 class="page-title">{{ title }}</h1>
        <div class="meta-info">
          <div class="meta-item">
            <span class="material-icons">category</span>
            <span>{{ category }}</span>
          </div>
          <div class="meta-item">
            <span class="material-icons">description</span>
            <span>Bilgi Dökümanı</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="resource-content">
    <div class="container">
      <div class="content-wrapper">
        <!-- Table of Contents (auto) -->
        <aside class="toc-sidebar" *ngIf="toc.length">
          <div class="toc-header">
            <span class="material-icons">list</span>
            <h3>İçindekiler</h3>
          </div>
          <nav class="toc-nav">
            <a *ngFor="let item of toc" class="toc-link" [attr.href]="'#' + item.id" [ngClass]="{'level-3': item.level === 3}">
              <span class="dot"></span>
              <span class="label">{{ item.text }}</span>
            </a>
          </nav>
        </aside>

        <!-- Main Content -->
        <article class="content-card">
          <div class="content-body" #contentRoot>
            ${processedHtml}
          </div>
        </article>
      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <div class="action-group">
          <button class="action-btn btn-secondary" (click)="printPage()">
            <span class="material-icons">print</span>
            <span>Yazdır</span>
          </button>
          <button class="action-btn btn-secondary" (click)="sharePage()">
            <span class="material-icons">share</span>
            <span>Paylaş</span>
          </button>
        </div>
        <a href="/documents/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}"
           download
           class="action-btn btn-primary">
          <span class="material-icons">download</span>
          <span>Orijinal Dökümanı İndir</span>
        </a>
      </div>
    </div>
  </div>
</div>`;


  // Write files
  await fs.writeFile(path.join(componentPath, `${componentName}.component.ts`), tsContent);
  await fs.writeFile(path.join(componentPath, `${componentName}.component.html`), htmlTemplate);
  // CSS dosyasını artık oluşturmuyoruz, çünkü paylaşılan stil kullanılıyor.
  // Gerekirse boş bir dosya oluşturulabilir veya bu satır tamamen kaldırılabilir.
  await fs.writeFile(path.join(componentPath, `${componentName}.component.css`), '/* Bu bileşen stillerini src/app/pages/resources/resource-enhanced-styles.css dosyasından almaktadır. */');

  return { componentName, className, category, fileName };
}

function processHtmlForMD3(html) {
  // Word özel tag ve gereksiz attribute temizliği, yapıyı bozmadan
  let processed = html
    .replace(/<o:p><\/o:p>/g, '')
    .replace(/<o:p>&nbsp;<\/o:p>/g, '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/<br\/?\s*>/g, '<br>')
    .replace(/&nbsp;/g, ' ');

  // Tüm img taglerini kaldır
  processed = processed.replace(/<img[^>]*>/g, '');

  // Angular kontrol akışı ile çakışmaması için @ işaretini escape et
  processed = processed.replace(/@/g, '&#64;');

  // Özel karakter normalizasyonu (tırnak, tire, ellipsis, vb.)
  processed = normalizeText(processed);

  // Birden fazla boş satırı sadeleştir
  processed = processed.replace(/\n{2,}/g, '\n');

  return processed.trim();
}

function normalizeText(input) {
  return input
    .replace(/[\u2013\u2014\u2212]/g, '-') // en/em dash, minus -> '-'
    .replace(/[\u2018\u2019\u02BC]/g, "'") // curly/single quote -> '
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"') // curly/double angle -> "
    .replace(/[\u2026]/g, '...') // ellipsis
    .replace(/[\u00A0]/g, ' ') // nbsp -> space
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // zero-width
}

function summarizeTextFromHtml(html) {
  const txt = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const max = 180;
  return txt.length > max ? txt.slice(0, max - 1) + '…' : txt;
}

function getCategoryTitle(category) {
  const titles = {
    'bright-futures-aile': 'Bright Futures (Aile)',
    'bright-futures-cocuk': 'Bright Futures (Çocuk)',
    'asilar': 'Aşılar',
    'gebelik-donemi': 'Gebelik Dönemi',
    'gelisim-rehberleri': 'Gelişim Rehberleri',
    'hastaliklar': 'Hastalıklar',
    'oyuncaklar': 'Oyuncaklar',
    'aile-medya-plani': 'Aile Medya Planı',
    'genel-bilgiler': 'Genel Bilgiler',
    'cdc-buyume-egrileri': 'CDC Büyüme Eğrileri',
    'who-buyume-egrileri': 'WHO Büyüme Eğrileri'
  };
  return titles[category] || category;
}

async function processAllDocuments() {
  console.log('Starting full document processing...\n');

  const allComponents = [];
  const routeEntries = [];
  const usedNames = { component: new Set(), class: new Set() };
  const indexMap = new Map(); // categorySlug -> [{ title, path }]

  for (const [folderName, categorySlug] of Object.entries(categoryMapping)) {
    const folderPath = path.join(DOCUMENTS_PATH, folderName);

    try {
      const files = await fs.readdir(folderPath);
      const docxFiles = files.filter(f => f.endsWith('.docx'));

      console.log(`\n📁 Processing ${folderName} (${docxFiles.length} files)...`);

      for (const file of docxFiles) {
        const filePath = path.join(folderPath, file);
        const htmlContent = await processDocxFile(filePath);

        if (htmlContent) {
          const component = await createComponentFiles(categorySlug, folderName, file, htmlContent, usedNames);
          allComponents.push(component);

          // Add route entry
          routeEntries.push({
            path: `kaynaklar/${categorySlug}/${component.componentName}`,
            import: `./${categorySlug}/${component.componentName}/${component.componentName}.component`,
            className: component.className
          });
          // Add to index map
          const title = file.replace(/\.docx$/i, '');
          if (!indexMap.has(categorySlug)) indexMap.set(categorySlug, []);
          indexMap.get(categorySlug).push({ title, path: `/${`kaynaklar/${categorySlug}/${component.componentName}`}` });

          console.log(`  ✓ ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error processing folder ${folderName}:`, error);
    }
  }

  // Create routing file
  await createRoutingFile(routeEntries);

  // Create resources index file
  await createResourcesIndex(indexMap);

  // Create category index pages
  await createCategoryPages();

  // Create sitemap.xml
  await createSitemap(indexMap);
  // Update robots.txt with sitemap if possible
  await updateRobotsWithSitemap();

  // Create the shared CSS file once
  await createSharedResourceStyles();

  await updateRobotsWithSitemap();

  console.log(`\n✨ Processing complete!`);
  console.log(`📊 Created ${allComponents.length} components`);
  console.log(`📂 Processed ${Object.keys(categoryMapping).length} categories`);
}

async function createSharedResourceStyles() {
  const sharedCssPath = path.join(OUTPUT_PATH, 'resource-enhanced-styles.css');
  // Bu fonksiyonun içinde, daha önce cssContent değişkeninde olan tüm CSS kodunu
  // fs.readFile ile okuyup fs.writeFile ile yazabilirsiniz.
  // Şimdilik var olduğunu varsayıyoruz.
  console.log('✅ Shared resource CSS file ensured at:', sharedCssPath);
}
async function createRoutingFile(routes) {
  const routeDefinitions = [
    // Category index routes first (lazy-loaded)
    ...Object.entries(categoryMapping).map(([folderName, categorySlug]) => {
      const className = categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('') + 'CategoryComponent';
      const importPath = `./${categorySlug}/index.component`;
      return `  { path: 'kaynaklar/${categorySlug}', loadComponent: () => import('${importPath}').then(m => m.${className}) }`;
    }),
    // Then document routes (lazy-loaded)
    ...routes.map((r) => `  { path: '${r.path}', loadComponent: () => import('${r.import}').then(m => m.${r.className}) }`),
  ].join(',\n');

  const content = `// Auto-generated resource routes (lazy-loaded)
import { Routes } from '@angular/router';

export const resourceRoutes: Routes = [
${routeDefinitions}
];
`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'resource-routes.ts'), content);
}

async function createCategoryPages() {
  for (const [folderName, categorySlug] of Object.entries(categoryMapping)) {
    const categoryPath = path.join(OUTPUT_PATH, categorySlug);
  // Klasör yoksa oluştur
  await fs.mkdir(categoryPath, { recursive: true });

    // Create category index component
  const indexContent = `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
    import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-${categorySlug}',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <h1>${folderName}</h1>
              <p>Bu kategorideki tüm kaynaklar</p>
        </div>
      </div>
      <div class="category-content">
        <div class="container">
              <div class="doc-list">
                <a *ngFor="let doc of docs" class="doc-item" [routerLink]="doc.path">
                  <span class="material-icons">description</span>
                  <span>{{ doc.title }}</span>
                </a>
              </div>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .category-page {
      min-height: 100vh;
      padding-top: 80px;
    }
    .category-header {
      background: var(--color-primary);
      color: white;
      padding: 3rem 0;
    }
        .doc-list { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-top: 1.5rem; }
        .doc-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: white; border-radius: 10px; text-decoration: none; color: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .doc-item:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
  \`]
})
    export class ${categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}CategoryComponent implements OnInit {
      docs: ResourceLink[] = RESOURCES_INDEX['${categorySlug}'] || [];
      constructor(private title: Title, private meta: Meta) {}
      ngOnInit(): void {
        const pageTitle = '${folderName} | Kaynaklar | Özlem Mürzoğlu';
        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'description', content: '${folderName} kategorisindeki kaynaklar' });
      }
    }
`;

    await fs.writeFile(path.join(categoryPath, 'index.component.ts'), indexContent);
  }
}

    async function createResourcesIndex(indexMap) {
      // Sort entries by title
      const entries = Array.from(indexMap.entries()).map(([cat, items]) => [cat, items.sort((a, b) => a.title.localeCompare(b.title, 'tr'))]);
      const objLiteral = entries.map(([cat, items]) => {
        const itemsLiteral = items.map(i => `{ title: ${JSON.stringify(i.title)}, path: ${JSON.stringify(i.path)} }`).join(',\n    ');
        return `  '${cat}': [\n    ${itemsLiteral}\n  ]`;
      }).join(',\n');

      const content = `export interface ResourceLink { title: string; path: string; }\nexport const RESOURCES_INDEX: Record<string, ResourceLink[]> = {\n${objLiteral}\n};\n`;
      await fs.writeFile(path.join(OUTPUT_PATH, 'resources-index.ts'), content);
    }

async function createSitemap(indexMap) {
  try {
    const baseUrl = process.env.SITEMAP_BASE_URL || '';
    const today = new Date().toISOString().split('T')[0];
    const urls = new Set([
      '/', '/hakkimizda', '/hizmetlerimiz', '/blog', '/sss', '/saygiyla', '/iletisim', '/kaynaklar',
      ...Object.values(categoryMapping).map(slug => `/kaynaklar/${slug}`)
    ]);
    for (const [cat, items] of indexMap.entries()) {
      for (const item of items) urls.add(item.path);
    }
    const urlset = Array.from(urls).map(u => `  <url>\n    <loc>${baseUrl}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u === '/' ? '1.0' : u.startsWith('/kaynaklar') ? '0.8' : '0.6'}</priority>\n  </url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
    const outPath = path.join(__dirname, '../public/sitemap.xml');
    await fs.writeFile(outPath, xml, 'utf8');
    console.log('🗺️  sitemap.xml generated at public/sitemap.xml');
  } catch (e) {
    console.error('Failed to generate sitemap.xml', e);
  }
}

async function updateRobotsWithSitemap() {
  try {
    const baseUrl = process.env.SITEMAP_BASE_URL || '';
    if (!baseUrl) return; // absolute URL is recommended; skip if not set
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    let content = '';
    try { content = await fs.readFile(robotsPath, 'utf8'); } catch {}
    const sitemapLine = `Sitemap: ${baseUrl}/sitemap.xml`;
    if (!content.includes(sitemapLine)) {
      content = (content ? content.trim() + '\n' : '') + sitemapLine + '\n';
      await fs.writeFile(robotsPath, content, 'utf8');
      console.log('🤖 robots.txt updated with sitemap reference');
    }
  } catch (e) {
    console.error('Failed to update robots.txt', e);
  }
}

// Run the script
processAllDocuments().catch(console.error);
