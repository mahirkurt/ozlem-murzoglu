import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appOptimizeImage]',
  standalone: true,
})
export class ImageOptimizationDirective implements OnInit {
  @Input() appOptimizeImage = true;
  @Input() lazy = true;
  @Input() sizes = '100vw';
  @Input() priority = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const img = this.el.nativeElement;

    // Lazy loading
    if (this.lazy && !this.priority) {
      this.renderer.setAttribute(img, 'loading', 'lazy');
    } else {
      this.renderer.setAttribute(img, 'loading', 'eager');
    }

    // Decoding async for better performance
    this.renderer.setAttribute(img, 'decoding', 'async');

    // Add responsive sizes
    if (this.sizes) {
      this.renderer.setAttribute(img, 'sizes', this.sizes);
    }

    // Generate srcset if not present
    const src = img.getAttribute('src');
    if (src && !img.getAttribute('srcset')) {
      const srcset = this.generateSrcset(src);
      if (srcset) {
        this.renderer.setAttribute(img, 'srcset', srcset);
      }
    }

    // Add alt text warning in development
    if (!img.getAttribute('alt')) {
      console.warn('Image missing alt text:', src);
      this.renderer.setAttribute(img, 'alt', '');
    }

    // Add aspect ratio for CLS prevention
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');
    if (width && height) {
      const aspectRatio = `${width} / ${height}`;
      this.renderer.setStyle(img, 'aspect-ratio', aspectRatio);
    }
  }

  private generateSrcset(src: string): string | null {
    // Skip if external URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return null;
    }

    // Generate responsive image sizes
    const basePath = src.substring(0, src.lastIndexOf('.'));
    const extension = src.substring(src.lastIndexOf('.'));

    // Common breakpoints
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcsetArray: string[] = [];

    sizes.forEach((size) => {
      // This assumes you have responsive images generated
      // In production, you'd use a CDN or image service
      srcsetArray.push(`${basePath}-${size}w${extension} ${size}w`);
    });

    return srcsetArray.join(', ');
  }
}
