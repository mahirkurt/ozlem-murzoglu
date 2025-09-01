import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-geli-im-basamaklar-4-ya',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="DEVELOPMENT_4_YEARS"
      categoryKey="development">
    </app-base-resource>
  `
})
export class GeliImBasamaklar4YaComponent {
}
