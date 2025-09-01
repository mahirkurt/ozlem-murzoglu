import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-bademcik-ltihab',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="TONSILLITIS"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class BademcikIltihabiComponent {
}
