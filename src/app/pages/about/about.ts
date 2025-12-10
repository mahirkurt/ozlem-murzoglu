import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ScrollRevealDirective, PageHeaderComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { translateKey: 'HEADER.NAV_HOME', url: '/' },
    { translateKey: 'HEADER.NAV_ABOUT' }
  ];
}
