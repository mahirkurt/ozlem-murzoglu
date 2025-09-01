import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-emzirme-pu-lar-yerle-me-ve-kavrama',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="BREASTFEEDING_POSITIONING"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class EmzirmePuLarYerleMeVeKavramaComponent {}
