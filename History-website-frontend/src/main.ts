import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import '@angular/localize/init';  // Importă localize pentru a asigura inițializarea corectă

// Folosește appConfig care include toate configurațiile necesare
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));