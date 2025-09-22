import { Routes } from '@angular/router';
// Üst seviye sayfaları lazy-load’a çevir
// Not: ResourcesComponent yoğun indeks/arama için anasayfada da lazy-load edilebilir
// ancak kategori/doküman rotaları zaten lazy-load edildiğinden başlangıç paketi küçülecek.
import { resourceRoutes } from './pages/resources/resource-routes';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'hakkimizda', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent) },
  { path: 'hakkimizda/dr-ozlem-murzoglu', loadComponent: () => import('./pages/about/dr-ozlem-murzoglu/dr-ozlem-murzoglu.component').then(m => m.DrOzlemMurzogluComponent) },
  { path: 'hakkimizda/klinigimiz', loadComponent: () => import('./pages/about/klinigimiz/klinigimiz.component').then(m => m.KlinigimizComponent) },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'hizmetlerimiz/laboratuvar-goruntuleme', loadComponent: () => import('./pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component').then(m => m.LaboratuvarGoruntulemeComponent) },
  { path: 'hizmetlerimiz/triple-p', loadComponent: () => import('./pages/services/triple-p/triple-p.component').then(m => m.TriplePComponent) },
  { path: 'hizmetlerimiz/saglikli-uykular', loadComponent: () => import('./pages/services/saglikli-uykular/saglikli-uykular.component').then(m => m.SaglikliUykularComponent) },
  { path: 'hizmetlerimiz/bright-futures-program', loadComponent: () => import('./pages/services/bright-futures-program/bright-futures-program.component').then(m => m.BrightFuturesProgramComponent) },
  { path: 'hizmetlerimiz/sos-feeding', loadComponent: () => import('./pages/services/sos-feeding/sos-feeding.component').then(m => m.SosFeedingComponent) },
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
