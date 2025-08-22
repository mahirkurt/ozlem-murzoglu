import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact';
import { AboutComponent } from './pages/about/about';
import { BlogComponent } from './pages/blog/blog';
import { ServicesComponent } from './pages/services/services';
import { FaqComponent } from './pages/faq/faq';
import { SaygiylaComponent } from './pages/saygiyla/saygiyla';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hakkimizda', component: AboutComponent },
  { path: 'hizmetlerimiz', component: ServicesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'sss', component: FaqComponent },
  { path: 'saygiyla', component: SaygiylaComponent },
  { path: 'iletisim', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
