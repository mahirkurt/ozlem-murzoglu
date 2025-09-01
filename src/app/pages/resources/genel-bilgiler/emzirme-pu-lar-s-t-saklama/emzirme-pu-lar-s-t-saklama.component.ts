import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-emzirme-pu-lar-s-t-saklama',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="BREASTFEEDING_MILK_STORAGE"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class EmzirmePuLarSTSaklamaComponent {}
