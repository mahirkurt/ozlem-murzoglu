import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-kkks-a-s-bilgi-f-y',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="KKKS_VACCINE"
      categoryKey="vaccines">
    </app-base-resource>
  `,
  styles: []
})
export class KkksASBilgiFYComponent {}