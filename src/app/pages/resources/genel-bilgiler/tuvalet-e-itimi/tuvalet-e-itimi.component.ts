import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-tuvalet-e-itimi',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="TOILET_TRAINING"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class TuvaletEgitimiComponent {}
