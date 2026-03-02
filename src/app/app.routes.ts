import { Routes } from '@angular/router';
// Üst seviye sayfaları lazy-load’a çevir
// Not: ResourcesComponent yoğun indeks/arama için anasayfada da lazy-load edilebilir
// ancak kategori/doküman rotaları zaten lazy-load edildiğinden başlangıç paketi küçülecek.
import { resourceRoutes } from './pages/resources/resource-routes';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), data: { animation: 'Home' } },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'anasayfa', redirectTo: '', pathMatch: 'full' },
  { path: 'anasayfa/:slug', redirectTo: '', pathMatch: 'full' },
  { path: 'hakkimizda', loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent), data: { animation: 'About' } },
  { path: 'hakkimizda/dr-ozlem-murzoglu', loadComponent: () => import('./pages/about/dr-ozlem-murzoglu/dr-ozlem-murzoglu.component').then(m => m.DrOzlemMurzogluComponent), data: { animation: 'DrOzlem' } },
  { path: 'hakkimizda/klinigimiz', loadComponent: () => import('./pages/about/klinigimiz/klinigimiz.component').then(m => m.KlinigimizComponent), data: { animation: 'Clinic' } },
  { path: 'hakkimizda/sss', loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent), data: { animation: 'FAQ' } },
  { path: 'sss', redirectTo: 'hakkimizda/sss', pathMatch: 'full' },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent), data: { animation: 'Services' } },
  { path: 'hizmetlerimiz/asi-takibi', redirectTo: 'hizmetlerimiz', pathMatch: 'full' },
  { path: 'hizmetlerimiz/gelisim-takibi', redirectTo: 'hizmetlerimiz', pathMatch: 'full' },
  { path: 'hizmetlerimiz/gelisim-degerlendirmesi', redirectTo: 'hizmetlerimiz', pathMatch: 'full' },
  { path: 'hizmetlerimiz/laboratuvar-goruntuleme', loadComponent: () => import('./pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component').then(m => m.LaboratuvarGoruntulemeComponent), data: { animation: 'LabImaging' } },
  { path: 'hizmetlerimiz/triple-p', loadComponent: () => import('./pages/services/triple-p/triple-p.component').then(m => m.TriplePComponent), data: { animation: 'TripleP' } },
  { path: 'hizmetlerimiz/saglikli-uykular', loadComponent: () => import('./pages/services/saglikli-uykular/saglikli-uykular.component').then(m => m.SaglikliUykularComponent), data: { animation: 'HealthySleep' } },
  { path: 'hizmetlerimiz/bright-futures-program', loadComponent: () => import('./pages/services/bright-futures-program/bright-futures-program.component').then(m => m.BrightFuturesProgramComponent), data: { animation: 'BrightFutures' } },
  { path: 'hizmetlerimiz/sos-feeding', loadComponent: () => import('./pages/services/sos-feeding/sos-feeding.component').then(m => m.SosFeedingComponent), data: { animation: 'SOSFeeding' } },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent), data: { animation: 'Blog' } },
  { path: 'blog/:slug', loadComponent: () => import('./components/blog-article/blog-article.component').then(m => m.BlogArticleComponent), data: { animation: 'BlogArticle' } },
  { path: 'saygiyla', loadComponent: () => import('./pages/saygiyla/saygiyla').then(m => m.SaygiylaComponent), data: { animation: 'Saygiyla' } },
  { path: 'kaynaklar', loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent), data: { animation: 'Resources' } },
  { path: 'bilgi-merkezi', redirectTo: 'kaynaklar', pathMatch: 'full' },
  { path: 'bilgi-merkezi/:category', redirectTo: 'kaynaklar/:category', pathMatch: 'full' },
  { path: 'bilgi-merkezi/:category/:doc', redirectTo: 'kaynaklar/:category/:doc', pathMatch: 'full' },
  // Otomatik üretilen kategori ve döküman rotaları
  ...resourceRoutes,
  { path: 'randevu', loadComponent: () => import('./pages/appointment/appointment.component').then(m => m.AppointmentComponent), data: { animation: 'Appointment' } },
  { path: 'iletisim', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent), data: { animation: 'Contact' } },
  { path: 'legal/privacy', loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent), data: { animation: 'Privacy' } },
  { path: 'legal/terms', loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent), data: { animation: 'Terms' } },
  { path: 'legal/kvkk', loadComponent: () => import('./pages/legal/kvkk/kvkk.component').then(m => m.KvkkComponent), data: { animation: 'KVKK' } },
  { path: 'yasal/gizlilik', redirectTo: 'legal/privacy', pathMatch: 'full' },
  { path: 'yasal/kullanim-kosullari', redirectTo: 'legal/terms', pathMatch: 'full' },
  { path: 'yasal/kvkk', redirectTo: 'legal/kvkk', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
