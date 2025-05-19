import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import '@angular/localize/init';  // Importă localize pentru a asigura inițializarea corectă

// Importă locale-urile necesare pentru DatePipe
import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';

// Înregistrează locale-urile
registerLocaleData(localeRo, 'ro');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de');

// Folosește appConfig care include toate configurațiile necesare
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));