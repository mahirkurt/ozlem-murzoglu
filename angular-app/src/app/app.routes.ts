import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'iletisim', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
