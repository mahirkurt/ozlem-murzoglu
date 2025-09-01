import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-ast-m-ataklar-ndan-korunma',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="ASTHMA_ATTACK_PREVENTION"
      categoryKey="diseases">
    </app-base-resource>
  `
})
export class AstimAtaklarindanKorunmaComponent {
}
