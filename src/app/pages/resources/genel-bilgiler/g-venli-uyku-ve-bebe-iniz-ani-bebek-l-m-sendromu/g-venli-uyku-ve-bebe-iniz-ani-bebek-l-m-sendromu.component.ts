import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-g-venli-uyku-ve-bebe-iniz-ani-bebek-l-m-sendromu',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="SAFE_SLEEP_SIDS"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class GVenliUykuVeBebeInizAniBebekLMSendromuComponent {}
