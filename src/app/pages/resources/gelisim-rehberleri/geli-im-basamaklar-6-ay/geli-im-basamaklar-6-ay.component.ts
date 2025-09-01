import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-geli-im-basamaklar-6-ay',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_6_MONTHS"
      categoryKey="development">
    </app-base-resource>
  `
})
export class GeliImBasamaklar6AyComponent {
}
