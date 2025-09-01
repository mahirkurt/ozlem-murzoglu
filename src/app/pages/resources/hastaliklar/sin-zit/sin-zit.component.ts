import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-sin-zit',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="SINUSITIS"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class SinuzitComponent {
}
