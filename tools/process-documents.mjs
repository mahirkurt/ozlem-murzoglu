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

async function processDocxFile(filePath) {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

async function createComponentFiles(category, fileName, htmlContent) {
  const componentName = fileName
    .replace(/\.docx$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const className = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Component';
  
  const categoryPath = path.join(OUTPUT_PATH, category);
  await fs.mkdir(categoryPath, { recursive: true });
  
  const componentPath = path.join(categoryPath, componentName);
  await fs.mkdir(componentPath, { recursive: true });
  
  // Process HTML content for Material Design 3
  const processedHtml = processHtmlForMD3(htmlContent, fileName);
  
  // Create component TypeScript file
  const tsContent = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './${componentName}.component.html',
  styleUrl: './${componentName}.component.css'
})
export class ${className} {
  title = '${fileName.replace(/\.docx$/i, '')}';
}
`;
  
  // Create component HTML file
  const htmlTemplate = `<div class="resource-page">
  <div class="resource-header">
    <div class="container">
      <nav class="breadcrumb">
        <a routerLink="/kaynaklar">Kaynaklar</a>
        <span class="separator">/</span>
        <a routerLink="/kaynaklar/${category}">${getCategoryTitle(category)}</a>
        <span class="separator">/</span>
        <span class="current">{{ title }}</span>
      </nav>
      <h1 class="page-title">{{ title }}</h1>
    </div>
  </div>
  
  <div class="resource-content">
    <div class="container">
      <article class="content-card">
        ${processedHtml}
      </article>
    </div>
  </div>
</div>`;
  
  // Create component CSS file
  const cssContent = `.resource-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--color-neutral-50);
}

.resource-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.breadcrumb a {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb a:hover {
  opacity: 0.7;
}

.separator {
  opacity: 0.5;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.resource-content {
  padding-bottom: 4rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.content-card h1,
.content-card h2,
.content-card h3,
.content-card h4 {
  color: var(--color-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.content-card h1:first-child,
.content-card h2:first-child {
  margin-top: 0;
}

.content-card p {
  line-height: 1.7;
  color: var(--color-neutral-700);
  margin-bottom: 1rem;
}

.content-card ul,
.content-card ol {
  margin: 1rem 0;
  padding-left: 2rem;
  color: var(--color-neutral-700);
}

.content-card li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.content-card strong {
  color: var(--color-primary-dark);
  font-weight: 600;
}

.content-card table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.content-card th {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
}

.content-card td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-neutral-200);
}

.content-card tr:last-child td {
  border-bottom: none;
}

.content-card tr:nth-child(even) {
  background: var(--color-neutral-50);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .content-card {
    padding: 1.5rem;
  }
}
`;
  
  // Write files
  await fs.writeFile(path.join(componentPath, `${componentName}.component.ts`), tsContent);
  await fs.writeFile(path.join(componentPath, `${componentName}.component.html`), htmlTemplate);
  await fs.writeFile(path.join(componentPath, `${componentName}.component.css`), cssContent);
  
  return { componentName, className, category };
}

function processHtmlForMD3(html, fileName) {
  // Clean up Word-specific HTML
  let processed = html
    .replace(/<o:p><\/o:p>/g, '')
    .replace(/<o:p>&nbsp;<\/o:p>/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/<span\s*>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<br\/>/g, '<br>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Add MD3 classes
  processed = processed
    .replace(/<h1>/g, '<h2 class="section-title">')
    .replace(/<h1/g, '<h2')
    .replace(/<\/h1>/g, '</h2>')
    .replace(/<ul>/g, '<ul class="content-list">')
    .replace(/<ol>/g, '<ol class="content-list">')
    .replace(/<table>/g, '<table class="data-table">');
  
  return processed;
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
  console.log('Starting document processing...');
  
  const components = [];
  
  for (const [folderName, categorySlug] of Object.entries(categoryMapping)) {
    const folderPath = path.join(DOCUMENTS_PATH, folderName);
    
    try {
      const files = await fs.readdir(folderPath);
      const docxFiles = files.filter(f => f.endsWith('.docx'));
      
      console.log(`Processing ${docxFiles.length} files in ${folderName}...`);
      
      for (const file of docxFiles) {
        const filePath = path.join(folderPath, file);
        const htmlContent = await processDocxFile(filePath);
        
        if (htmlContent) {
          const component = await createComponentFiles(categorySlug, file, htmlContent);
          components.push(component);
          console.log(`  ✓ Processed: ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error processing folder ${folderName}:`, error);
    }
  }
  
  // Create index file for routing
  await createRoutingIndex(components);
  
  console.log(`\nProcessing complete! Created ${components.length} components.`);
}

async function createRoutingIndex(components) {
  const routesContent = components.map(comp => 
    `  { path: '${comp.category}/${comp.componentName}', loadComponent: () => import('./${comp.category}/${comp.componentName}/${comp.componentName}.component').then(m => m.${comp.className}) }`
  ).join(',\n');
  
  const indexContent = `// Auto-generated resource routes
export const resourceRoutes = [
${routesContent}
];
`;
  
  await fs.writeFile(path.join(OUTPUT_PATH, 'resource-routes.ts'), indexContent);
}

// Run the script
processAllDocuments().catch(console.error);