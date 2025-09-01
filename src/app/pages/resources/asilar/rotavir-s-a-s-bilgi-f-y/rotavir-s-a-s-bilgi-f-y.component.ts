import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-rotavir-s-a-s-bilgi-f-y',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="ROTAVIRUS_VACCINE"
      categoryKey="vaccines">
    </app-base-resource>
  `,
  styles: []
})
export class RotavirSASBilgiFYComponent {}
