import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saglikli-uykular',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule],
  templateUrl: './saglikli-uykular.component.html',
  styleUrl: './saglikli-uykular.component.css'
})
export class SaglikliUykularComponent {

}
