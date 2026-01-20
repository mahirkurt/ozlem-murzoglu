import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentCleanerService {

  constructor() { }

  /**
   * Cleans and processes resource page content
   */
  cleanResourceContent(element: HTMLElement): void {
    if (!element) return;

    // Remove contact information
    this.removeContactInfo(element);
    
    // Process disclaimers
    this.processDisclaimers(element);
    
    // Extract and fix real titles
    this.fixDocumentTitles(element);
    
    // Clean empty elements
    this.removeEmptyElements(element);
  }

  /**
   * Remove Dr. Murzoğlu contact information from content
   */
  private removeContactInfo(element: HTMLElement): void {
    const contactPatterns = [
      'Barbaros Mah',
      'Uphill Towers',
      'ozlemmurzoglu.com',
      'klinik@drmurzoglu.com',
      '0 216 688',
      '0 546 688',
      'UZM.DR. ÖZLEM MURZOĞLU',
      'ÇOCUK SAĞLIĞI VE HASTALIKLARI KLİNİĞİ'
    ];

    // Find and remove tables containing contact info
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      const tableText = table.textContent || '';
      const hasContactInfo = contactPatterns.some(pattern => 
        tableText.includes(pattern)
      );
      
      if (hasContactInfo) {
        // Check if it's the footer contact table
        const isFooter = tableText.includes('UZM.DR.') && 
                        tableText.includes('ÖZLEM') && 
                        tableText.includes('MURZOĞLU');
        
        if (isFooter || tableText.includes('Barbaros Mah')) {
          table.remove();
        } else if (tableText.includes('UZM.DR. ÖZLEM MURZOĞLU - ÇOCUK SAĞLIĞI')) {
          // This is likely a header, keep but clean
          const cleanedText = tableText
            .replace('UZM.DR. ÖZLEM MURZOĞLU - ÇOCUK SAĞLIĞI VE HASTALIKLARI KLİNİĞİ', '')
            .trim();
          if (cleanedText) {
            const p = document.createElement('p');
            p.className = 'document-source';
            p.textContent = cleanedText;
            table.replaceWith(p);
          } else {
            table.remove();
          }
        }
      }
    });
  }

  /**
   * Process and format disclaimer texts
   */
  private processDisclaimers(element: HTMLElement): void {
    const disclaimerPatterns = [
      {
        pattern: /Bright Futures.*Guidelines.*adresine gidin/is,
        type: 'bright-futures'
      },
      {
        pattern: /Bu broşürde yer alan bilgiler.*kullanılmamalıdır/is,
        type: 'general'
      },
      {
        pattern: /©.*Amerikan Pediatri Akademisi.*Tüm hakları saklıdır/is,
        type: 'aap'
      },
      {
        pattern: /AAP.*harici kaynakların içeriğinden sorumlu değildir/is,
        type: 'aap'
      }
    ];

    const paragraphs = Array.from(element.querySelectorAll('p'));
    const tables = Array.from(element.querySelectorAll('table'));
    
    // Check both paragraphs and tables for disclaimers
    [...paragraphs, ...tables].forEach(elem => {
      const text = elem.textContent || '';
      
      disclaimerPatterns.forEach(({ pattern, type }) => {
        if (pattern.test(text)) {
          const disclaimerDiv = this.createDisclaimerElement(text, type);
          elem.replaceWith(disclaimerDiv);
        }
      });
    });
  }

  /**
   * Create formatted disclaimer element
   */
  private createDisclaimerElement(text: string, type: string): HTMLElement {
    const container = document.createElement('div');
    container.className = 'disclaimer-section';

    if (type === 'bright-futures') {
      const bfDiv = document.createElement('div');
      bfDiv.className = 'bright-futures-disclaimer';
      
      const icon = document.createElement('div');
      icon.className = 'icon';
      icon.innerHTML = '<span class="material-icons-rounded">info</span>';
      
      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      
      // Convert URL to link
      const processedText = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener">$1</a>'
      );
      textDiv.innerHTML = processedText;
      
      bfDiv.appendChild(icon);
      bfDiv.appendChild(textDiv);
      container.appendChild(bfDiv);
      
    } else if (type === 'aap') {
      const aapDiv = document.createElement('div');
      aapDiv.className = 'aap-disclaimer';
      aapDiv.textContent = text;
      container.appendChild(aapDiv);
      
    } else {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'disclaimer-content';
      const p = document.createElement('p');
      p.textContent = text;
      contentDiv.appendChild(p);
      container.appendChild(contentDiv);
    }

    return container;
  }

  /**
   * Extract and fix document titles from DOCX content
   */
  private fixDocumentTitles(element: HTMLElement): void {
    // Common title patterns in DOCX files
    const titlePatterns = [
      {
        source: 'AMERİKAN PEDİATRİ AKADEMİSİ',
        selector: 'table:first-of-type'
      },
      {
        source: 'BRIGHT FUTURES',
        selector: 'table:first-of-type'
      },
      {
        source: 'CDC',
        selector: 'table:first-of-type'
      }
    ];

    // Check first few tables for real title
    const firstTables = element.querySelectorAll('table:nth-of-type(-n+3)');
    firstTables.forEach((table, index) => {
      const text = table.textContent || '';
      
      // Check if this contains a source organization
      titlePatterns.forEach(({ source }) => {
        if (text.includes(source)) {
          // Extract the actual title
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          
          if (lines.length > 0) {
            const sourceElem = document.createElement('div');
            sourceElem.className = 'document-source';
            sourceElem.textContent = lines[0]; // Organization name
            
            if (lines.length > 1) {
              const titleElem = document.createElement('h1');
              titleElem.className = 'real-document-title';
              
              // Combine remaining lines as title
              const title = lines.slice(1).join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              
              if (title && title.length > 3) {
                titleElem.textContent = this.formatTitle(title);
                
                // Replace table with proper elements
                const container = document.createElement('div');
                container.appendChild(sourceElem);
                container.appendChild(titleElem);
                table.replaceWith(container);
              }
            }
          }
        }
      });
    });
  }

  /**
   * Format title text properly
   */
  private formatTitle(title: string): string {
    // Clean up common issues
    return title
      .replace(/\s+/g, ' ')
      .replace(/^\W+|\W+$/g, '') // Remove leading/trailing non-word chars
      .replace(/\b([A-ZÇĞİÖŞÜ]{2,})\b/g, (match) => {
        // Convert all-caps words to title case
        if (match.length > 3) {
          return match.charAt(0) + match.slice(1).toLowerCase();
        }
        return match;
      })
      .trim();
  }

  /**
   * Remove empty elements
   */
  private removeEmptyElements(element: HTMLElement): void {
    // Remove empty paragraphs
    const emptyPs = element.querySelectorAll('p:empty');
    emptyPs.forEach(p => p.remove());
    
    // Remove tables with only empty cells
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      const hasContent = table.textContent?.trim();
      if (!hasContent) {
        table.remove();
      }
    });
    
    // Remove multiple consecutive br tags
    const brs = element.querySelectorAll('br + br');
    brs.forEach(br => br.remove());
  }

  /**
   * Get category-specific CSS class
   */
  getCategoryClass(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Gelişim Rehberleri': 'category-gelisim',
      'Aşılar': 'category-asilar',
      'Genel Bilgiler': 'category-genel',
      'Hastalıklar': 'category-hastaliklar',
      'Gebelik Dönemi': 'category-gebelik',
      'Aile Medya Planı': 'category-medya',
      'Oyuncaklar': 'category-oyuncaklar',
      'Bright Futures - Aile': 'category-bright-futures',
      'Bright Futures - Çocuk': 'category-bright-futures'
    };
    
    return categoryMap[category] || 'category-default';
  }
}