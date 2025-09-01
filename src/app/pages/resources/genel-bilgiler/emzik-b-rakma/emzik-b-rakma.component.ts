import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-emzik-b-rakma',
  standalone: true,
  imports: [BaseResourceComponent],
  template: `
    <app-base-resource
      resourceKey="PACIFIER_WEANING"
      categoryKey="general">
    </app-base-resource>
  `,
  styles: []
})
export class EmzikBRakmaComponent {}
