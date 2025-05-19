import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguages = 'ro' | 'en' | 'de';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguages>('ro');
  public currentLang$ = this.currentLangSubject.asObservable();

  // Adaugă aici toate textele care trebuie traduse din pagina istoric
  private translations: Record<string, Record<string, string>> = {
    'istoricTitle': {
      'ro': 'Istoric și Publicații',
      'en': 'History and Publications',
      'de': 'Geschichte und Publikationen'
    },
    'scurtIstoric': {
      'ro': 'Scurt istoric',
      'en': 'Brief History',
      'de': 'Kurze Geschichte'
    },
    'publicatiiButton': {
      'ro': 'Publicații',
      'en': 'Publications',
      'de': 'Publikationen'
    }
    // Adaugă aici alte traduceri
  };

  constructor() {
    // Inițializează limba curentă
    this.initLanguage();
  }

  private initLanguage() {
    // Verifică dacă avem parametrul lang în URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as SupportedLanguages;
      
      if (langParam && this.isValidLanguage(langParam)) {
        this.setLanguage(langParam);
        return;
      }
      
      // Verifică localStorage
      const savedLang = localStorage.getItem('selectedLanguage') as SupportedLanguages;
      if (savedLang && this.isValidLanguage(savedLang)) {
        this.setLanguage(savedLang);
        return;
      }
      
      // Folosește limba browser-ului
      const browserLang = navigator.language.split('-')[0] as SupportedLanguages;
      if (this.isValidLanguage(browserLang)) {
        this.setLanguage(browserLang);
        return;
      }
    }
    
    // Default la română
    this.setLanguage('ro');
  }

  public isValidLanguage(lang: string): lang is SupportedLanguages {
    return ['ro', 'en', 'de'].includes(lang);
  }

  public getLanguage(): SupportedLanguages {
    return this.currentLangSubject.value;
  }

  public setLanguage(lang: SupportedLanguages): void {
    localStorage.setItem('selectedLanguage', lang);
    this.currentLangSubject.next(lang);
  }

  public translate(key: string): string {
    const lang = this.getLanguage();
    
    // Verifică dacă cheia există
    if (this.translations[key] && this.translations[key][lang]) {
      return this.translations[key][lang];
    }
    
    // Returnează cheia dacă nu există traducere
    return key;
  }
}