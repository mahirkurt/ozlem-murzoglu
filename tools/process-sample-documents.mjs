import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_PATH = path.join(__dirname, '../public/documents');
const OUTPUT_PATH = path.join(__dirname, '../src/app/pages/resources');

// Test için sadece birkaç dosya işleyelim
const sampleFiles = [
  { category: 'bright-futures-aile', folder: 'Bright Futures (Aile)', file: '1. Ay - Aile İçin Bilgiler.docx' },
  { category: 'asilar', folder: 'Aşılar', file: 'HPV Aşısı Bilgi Föyü.docx' },
  { category: 'asilar', folder: 'Aşılar', file: 'KKK Aşısı Bilgi Föyü.docx' }
];

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
    .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '-')
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
      
      <div class="action-buttons">
        <button class="btn-secondary" onclick="window.print()">
          <span class="material-icons">print</span>
          <span>Yazdır</span>
        </button>
        <a href="/documents/${category}/${fileName}" download class="btn-primary">
          <span class="material-icons">download</span>
          <span>İndir</span>
        </a>
      </div>
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
  box-shadow: var(--shadow-lg);
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resource-content {
  padding-bottom: 4rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

.content-card h1,
.content-card h2,
.content-card h3,
.content-card h4 {
  color: var(--color-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.content-card h1:first-child,
.content-card h2:first-child {
  margin-top: 0;
}

.content-card h2 {
  font-size: 1.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary-light);
}

.content-card h3 {
  font-size: 1.25rem;
  color: var(--color-primary-dark);
}

.content-card p {
  line-height: 1.8;
  color: var(--color-neutral-700);
  margin-bottom: 1rem;
  text-align: justify;
}

.content-card ul,
.content-card ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
  color: var(--color-neutral-700);
}

.content-card li {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.content-card li::marker {
  color: var(--color-primary);
}

.content-card strong {
  color: var(--color-primary-dark);
  font-weight: 600;
}

.content-card em {
  color: var(--color-secondary-dark);
  font-style: italic;
}

.content-card table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.content-card th {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-card td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-neutral-200);
  transition: background-color 0.2s;
}

.content-card tr:last-child td {
  border-bottom: none;
}

.content-card tr:hover td {
  background: var(--color-primary-light);
  background: rgba(0, 95, 115, 0.05);
}

.content-card tr:nth-child(even) td {
  background: var(--color-neutral-50);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}

.material-icons {
  font-size: 20px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .content-card {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  .content-card h2 {
    font-size: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

@media print {
  .resource-header,
  .action-buttons {
    display: none;
  }
  
  .resource-page {
    padding-top: 0;
  }
  
  .content-card {
    box-shadow: none;
    padding: 0;
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
    .replace(/<br\/>/g, '<br>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Fix encoding issues
  processed = processed
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '—');
  
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
    'genel-bilgiler': 'Genel Bilgiler'
  };
  return titles[category] || category;
}

async function processSampleDocuments() {
  console.log('Processing sample documents...\n');
  
  const components = [];
  
  for (const sample of sampleFiles) {
    const filePath = path.join(DOCUMENTS_PATH, sample.folder, sample.file);
    
    try {
      const htmlContent = await processDocxFile(filePath);
      
      if (htmlContent) {
        const component = await createComponentFiles(sample.category, sample.file, htmlContent);
        components.push(component);
        console.log(`✓ Processed: ${sample.file}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${sample.file}:`, error.message);
    }
  }
  
  console.log(`\nProcessing complete! Created ${components.length} sample components.`);
  console.log('\nCreated components:');
  components.forEach(c => {
    console.log(`  - ${c.category}/${c.componentName}`);
  });
}

// Run the script
processSampleDocuments().catch(console.error);