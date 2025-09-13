import { Routes } from '@angular/router';
// Üst seviye sayfaları lazy-load’a çevir
// Not: ResourcesComponent yoğun indeks/arama için anasayfada da lazy-load edilebilir
// ancak kategori/doküman rotaları zaten lazy-load edildiğinden başlangıç paketi küçülecek.
import { resourceRoutes } from './pages/resources/resource-routes';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'hakkimizda', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'sss', loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent) },
  { path: 'saygiyla', loadComponent: () => import('./pages/saygiyla/saygiyla').then(m => m.SaygiylaComponent) },
  { path: 'kaynaklar', loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent) },
  { path: 'favoriler', loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent) },
  // Otomatik üretilen kategori ve döküman rotaları
  ...resourceRoutes,
  { path: 'iletisim', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  // Legal pages
  { path: 'legal/privacy', loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'legal/terms', loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent) },
  { path: 'legal/kvkk', loadComponent: () => import('./pages/legal/kvkk/kvkk.component').then(m => m.KvkkComponent) },
  { path: '**', redirectTo: '' }
];
