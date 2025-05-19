import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '../services/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';

// Funcție pentru a determina limba locală
function getLocaleProvider() {
  // În browserul client, obține limba din URL sau localStorage
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && ['ro', 'en', 'de'].includes(langParam)) {
      return { provide: LOCALE_ID, useValue: langParam };
    }
    
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && ['ro', 'en', 'de'].includes(savedLang)) {
      return { provide: LOCALE_ID, useValue: savedLang };
    }
  }
  
  // Default la română dacă nu avem altă limbă selectată
  return { provide: LOCALE_ID, useValue: 'ro' };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideClientHydration(),
    getLocaleProvider()
  ]
};
