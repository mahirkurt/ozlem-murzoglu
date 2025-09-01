import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-geli-im-basamaklar-6-ay-yeni',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_6_MONTHS_NEW"
      categoryKey="development">
    </app-base-resource>
  `
})
export class GeliImBasamaklar6AyYeniComponent {
}
