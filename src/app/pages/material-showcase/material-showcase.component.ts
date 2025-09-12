import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-material-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './material-showcase.component.html',
  styleUrls: ['./material-showcase.component.scss'],
})
export class MaterialShowcaseComponent {
  email: string = '';
  password: string = '';
  progressValue = 60;

  services = [
    { name: 'Bright Futures', icon: 'star', color: 'primary' },
    { name: 'SOS Feeding', icon: 'restaurant', color: 'accent' },
    { name: 'Laboratuvar', icon: 'science', color: 'warn' },
    { name: 'Sağlıklı Uykular', icon: 'bedtime', color: 'primary' },
  ];

  constructor(private snackBar: MatSnackBar) {}

  showSnackbar() {
    this.snackBar.open('MD3 Expressive tema başarıyla uygulandı!', 'Kapat', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
