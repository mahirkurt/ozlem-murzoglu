import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './appointment-section.component.html',
  styleUrl: './appointment-section.component.scss'
})
export class AppointmentSectionComponent {
  showEmbedded = false;
  appointmentUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.appointmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://saglikpetegim.com/randevu');
  }
}