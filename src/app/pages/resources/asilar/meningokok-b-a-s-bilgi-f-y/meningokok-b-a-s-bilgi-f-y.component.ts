import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-meningokok-b-a-s-bilgi-f-y',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="MENINGOKOK_B_VACCINE"
      categoryKey="vaccines">
    </app-base-resource>
  `,
  styles: []
})
export class MeningokokBASBilgiFYComponent {}
