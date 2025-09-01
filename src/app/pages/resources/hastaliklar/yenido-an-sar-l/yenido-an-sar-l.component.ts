import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-yenido-an-sar-l',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="NEWBORN_JAUNDICE"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class YenidoganSariligiComponent {
}
