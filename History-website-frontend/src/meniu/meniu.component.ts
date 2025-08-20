import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService, SupportedLanguages } from '../services/i18n/translation.service';
import { TranslatePipe } from '../services/i18n/translate.pipe';

@Component({
  selector: 'app-meniu',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslatePipe],
  templateUrl: './meniu.component.html',
  styleUrl: './meniu.component.css',
  providers: [TranslationService]
})
export class MeniuComponent {
  selectedLanguage: SupportedLanguages = 'ro';
  
  constructor(private translationService: TranslationService) {
    this.translationService.currentLang$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }
  
  changeLanguage(lang: SupportedLanguages): void {
    this.translationService.setLanguage(lang);
    // Language changed successfully
    
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    let newUrl = currentPath;
    
    if (currentSearch.includes('lang=')) {
      newUrl += currentSearch.replace(/lang=[^&]+/, `lang=${lang}`);
    } else if (currentSearch) {
      newUrl += `${currentSearch}&lang=${lang}`;
    } else {
      newUrl += `?lang=${lang}`;
    }
    
    window.location.href = newUrl;
  }
}
