import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactCtaComponent } from '../../../components/contact-cta/contact-cta.component';
import { PageHeaderComponent, Breadcrumb } from '../../../components/page-header/page-header.component';

@Component({
  selector: 'app-dr-ozlem-murzoglu',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, ContactCtaComponent],
  templateUrl: './dr-ozlem-murzoglu.component.html',
  styleUrl: './dr-ozlem-murzoglu.component.css'
})
export class DrOzlemMurzogluComponent {
  breadcrumbs: Breadcrumb[] = [
    { translateKey: 'HEADER.NAV_HOME', url: '/' },
    { translateKey: 'HEADER.NAV_ABOUT', url: '/hakkimizda' },
    { translateKey: 'COMMON.DOCTOR_NAME' }
  ];
}
