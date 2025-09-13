import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-laboratuvar-goruntuleme',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './laboratuvar-goruntuleme.component.html',
  styleUrl: './laboratuvar-goruntuleme.component.css'
})
export class LaboratuvarGoruntulemeComponent {
  private translate = inject(TranslateService);
}
