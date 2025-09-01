import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-4-ya-geli-imsel-neriler',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_SUGGESTIONS_4_YEARS"
      categoryKey="development">
    </app-base-resource>
  `
})
export class Doc4YaGeliImselNerilerComponent {
}
