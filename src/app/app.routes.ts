import { Routes } from '@angular/router';
// Üst seviye sayfaları lazy-load’a çevir
// Not: ResourcesComponent yoğun indeks/arama için anasayfada da lazy-load edilebilir
// ancak kategori/doküman rotaları zaten lazy-load edildiğinden başlangıç paketi küçülecek.
import { resourceRoutes } from './pages/resources/resource-routes';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'hakkimizda', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'hakkimizda/dr-ozlem-murzoglu', loadComponent: () => import('./pages/about/dr-ozlem-murzoglu/dr-ozlem-murzoglu.component').then(m => m.DrOzlemMurzogluComponent) },
  { path: 'hakkimizda/klinik-tasarimi', loadComponent: () => import('./pages/about/klinik-tasarimi/klinik-tasarimi.component').then(m => m.KlinikTasarimiComponent) },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./components/blog-article/blog-article.component').then(m => m.BlogArticleComponent) },
  { path: 'sss', loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent) },
  { path: 'saygiyla', loadComponent: () => import('./pages/saygiyla/saygiyla').then(m => m.SaygiylaComponent) },
  { path: 'kaynaklar', loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent) },
  // Otomatik üretilen kategori ve döküman rotaları
  ...resourceRoutes,
  { path: 'iletisim', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '' }
];
