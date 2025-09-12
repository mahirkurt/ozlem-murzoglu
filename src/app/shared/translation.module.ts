import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false, // Important: share the same TranslateService instance
    }),
  ],
  exports: [TranslateModule],
})
export class SharedTranslationModule {
  constructor(private translate: TranslateService) {
    // Ensure the service uses the current language
    const currentLang =
      this.translate.currentLang ||
      this.translate.defaultLang ||
      (typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') : null) ||
      'tr';

    this.translate.setDefaultLang('tr');
    this.translate.use(currentLang);
  }
}
