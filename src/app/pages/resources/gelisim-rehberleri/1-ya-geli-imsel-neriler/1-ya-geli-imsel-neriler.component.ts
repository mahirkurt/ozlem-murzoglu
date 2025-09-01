import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-1-ya-geli-imsel-neriler',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_SUGGESTIONS_1_YEAR"
      categoryKey="development">
    </app-base-resource>
  `
})
export class Doc1YaGeliImselNerilerComponent {
}
