import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-bebe-inizi-emzirmek',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="BREASTFEEDING_YOUR_BABY"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class BebeiniziEmzirmekComponent {}
