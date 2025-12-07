import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-cta',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './contact-cta.component.html',
  styleUrls: ['./contact-cta.scss']
})
export class ContactCtaComponent {
  // Logic if needed, e.g. router navigation
}
