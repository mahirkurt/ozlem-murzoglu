import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-hpv-a-s-bilgi-f-y',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="HPV_VACCINE"
      categoryKey="vaccines">
    </app-base-resource>
  `,
  styles: []
})
export class HpvASBilgiFYComponent {}