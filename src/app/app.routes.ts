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
  { path: 'hakkimizda/sss', loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent) },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'hizmetlerimiz/laboratuvar-goruntuleme', loadComponent: () => import('./pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component').then(m => m.LaboratuvarGoruntulemeComponent) },
  { path: 'hizmetlerimiz/triple-p', loadComponent: () => import('./pages/services/triple-p/triple-p.component').then(m => m.TriplePComponent) },
  { path: 'hizmetlerimiz/saglikli-uykular', loadComponent: () => import('./pages/services/saglikli-uykular/saglikli-uykular.component').then(m => m.SaglikliUykularComponent) },
  { path: 'hizmetlerimiz/bright-futures-program', loadComponent: () => import('./pages/services/bright-futures-program/bright-futures-program.component').then(m => m.BrightFuturesProgramComponent) },
  { path: 'saygiyla', loadComponent: () => import('./pages/saygiyla/saygiyla').then(m => m.SaygiylaComponent) },
  { path: 'bilgi-merkezi', loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent) },
  { path: 'bilgi-merkezi/bright-futures-yolculugu', loadComponent: () => import('./pages/resources/bright-futures-journey/bright-futures-journey.component').then(m => m.BrightFuturesJourneyComponent) },
  // Otomatik üretilen kategori ve döküman rotaları
  ...resourceRoutes,
  { path: 'iletisim', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  // { path: 'randevu', loadComponent: () => import('./pages/appointment/appointment.component').then(m => m.AppointmentComponent) },
  { path: 'makaleler', loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent) },
  // { path: 'saygiyla/tesekkurler', loadComponent: () => import('./pages/saygiyla/tesekkurler/tesekkurler.component').then(m => m.TesekkurlerComponent) },
  // { path: 'saygiyla/anilar', loadComponent: () => import('./pages/saygiyla/anilar/anilar.component').then(m => m.AnilarComponent) },
  { path: 'gizlilik', loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'kullanim-kosullari', loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent) },
  { path: 'kvkk', loadComponent: () => import('./pages/legal/kvkk/kvkk.component').then(m => m.KvkkComponent) },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' }
];
