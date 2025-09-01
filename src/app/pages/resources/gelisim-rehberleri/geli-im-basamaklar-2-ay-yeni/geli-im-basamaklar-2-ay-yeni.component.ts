import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-geli-im-basamaklar-2-ay-yeni',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_2_MONTHS_NEW"
      categoryKey="development">
    </app-base-resource>
  `
})
export class GeliImBasamaklar2AyYeniComponent {
}
