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
  { path: 'hakkimizda/sss', loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent) },
  { path: 'hizmetlerimiz', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'hizmetlerimiz/laboratuvar-goruntuleme', loadComponent: () => import('./pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component').then(m => m.LaboratuvarGoruntulemeComponent) },
  { path: 'hizmetlerimiz/triple-p', loadComponent: () => import('./pages/services/triple-p/triple-p.component').then(m => m.TriplePComponent) },
  { path: 'hizmetlerimiz/saglikli-uykular', loadComponent: () => import('./pages/services/saglikli-uykular/saglikli-uykular.component').then(m => m.SaglikliUykularComponent) },
  { path: 'hizmetlerimiz/bright-futures-program', loadComponent: () => import('./pages/services/bright-futures-program/bright-futures-program.component').then(m => m.BrightFuturesProgramComponent) },
  { path: 'hizmetlerimiz/sos-feeding', loadComponent: () => import('./pages/services/sos-feeding/sos-feeding.component').then(m => m.SosFeedingComponent) },
  { path: 'saygiyla', loadComponent: () => import('./pages/saygiyla/saygiyla').then(m => m.SaygiylaComponent) },
  { path: 'saygiyla/ataturk', loadComponent: () => import('./pages/saygiyla/ataturk/ataturk.component').then(m => m.AtaturkComponent) },
  { path: 'saygiyla/turkan-saylan', loadComponent: () => import('./pages/saygiyla/turkan-saylan/turkan-saylan.component').then(m => m.TurkanSaylanComponent) },
  { path: 'saygiyla/ihsan-dogramaci', loadComponent: () => import('./pages/saygiyla/ihsan-dogramaci/ihsan-dogramaci.component').then(m => m.IhsanDogramaciComponent) },
  { path: 'saygiyla/jonas-salk', loadComponent: () => import('./pages/saygiyla/jonas-salk/jonas-salk.component').then(m => m.JonasSalkComponent) },
  { path: 'saygiyla/louis-pasteur', loadComponent: () => import('./pages/saygiyla/louis-pasteur/louis-pasteur.component').then(m => m.LouisPasteurComponent) },
  { path: 'saygiyla/virginia-apgar', loadComponent: () => import('./pages/saygiyla/virginia-apgar/virginia-apgar.component').then(m => m.VirginiaApgarComponent) },
  { path: 'saygiyla/malala-yousafzai', loadComponent: () => import('./pages/saygiyla/malala-yousafzai/malala-yousafzai.component').then(m => m.MalalaYousafzaiComponent) },
  { path: 'saygiyla/nils-rosen', loadComponent: () => import('./pages/saygiyla/nils-rosen/nils-rosen.component').then(m => m.NilsRosenComponent) },
  { path: 'saygiyla/waldo-nelson', loadComponent: () => import('./pages/saygiyla/waldo-nelson/waldo-nelson.component').then(m => m.WaldoNelsonComponent) },
  { path: 'saygiyla/ursula-leguin', loadComponent: () => import('./pages/saygiyla/ursula-leguin/ursula-leguin.component').then(m => m.UrsulaLeguinComponent) },
  { path: 'bilgi-merkezi', loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent) },
  { path: 'bilgi-merkezi/bright-futures-yolculugu', loadComponent: () => import('./pages/resources/bright-futures-journey/bright-futures-journey.component').then(m => m.BrightFuturesJourneyComponent) },
  // Otomatik üretilen kategori ve döküman rotaları
  ...resourceRoutes,
  { path: 'iletisim', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  // { path: 'randevu', loadComponent: () => import('./pages/appointment/appointment.component').then(m => m.AppointmentComponent) },
  { path: 'makaleler', loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent) },
  { path: 'gizlilik', loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'kullanim-kosullari', loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent) },
  { path: 'kvkk', loadComponent: () => import('./pages/legal/kvkk/kvkk.component').then(m => m.KvkkComponent) },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' }
];
