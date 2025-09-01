import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-orta-kulak-ltihab',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="MIDDLE_EAR_INFECTION"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class OrtaKulakIltihabiComponent {
}
