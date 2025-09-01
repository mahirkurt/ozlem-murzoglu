import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-antibiyotikler',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="ANTIBIOTICS"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class AntibiyotiklerComponent {
}
