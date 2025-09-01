import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-ocuklarda-ate',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="FEVER_IN_CHILDREN"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class CocuklardaAtesComponent {
}
