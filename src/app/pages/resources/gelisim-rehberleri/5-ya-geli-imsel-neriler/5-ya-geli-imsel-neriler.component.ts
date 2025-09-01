import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-5-ya-geli-imsel-neriler',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_SUGGESTIONS_5_YEARS"
      categoryKey="development">
    </app-base-resource>
  `
})
export class Doc5YaGeliImselNerilerComponent {
}
