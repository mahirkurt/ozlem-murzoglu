import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-pi-ikler',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="RASHES"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class PisiklerComponent {
}
