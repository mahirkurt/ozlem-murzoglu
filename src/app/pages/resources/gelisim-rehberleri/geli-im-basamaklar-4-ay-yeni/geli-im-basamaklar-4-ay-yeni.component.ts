import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-geli-im-basamaklar-4-ay-yeni',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_4_MONTHS_NEW"
      categoryKey="development">
    </app-base-resource>
  `
})
export class GeliImBasamaklar4AyYeniComponent {
}
