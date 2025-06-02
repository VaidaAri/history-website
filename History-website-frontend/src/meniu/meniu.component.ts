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
    // Abonează-te la schimbările de limbă
    this.translationService.currentLang$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }
  
  changeLanguage(lang: SupportedLanguages): void {
    // Schimbă limba utilizând serviciul
    this.translationService.setLanguage(lang);
    console.log(`Limba a fost schimbată în: ${lang}`);
    
    // Actualizează URL-ul cu parametrul de limbă
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Adaugă parametrul de limbă la URL
    let newUrl = currentPath;
    
    // Adaugă parametrul lang la query string
    if (currentSearch.includes('lang=')) {
      // Înlocuiește parametrul lang existent
      newUrl += currentSearch.replace(/lang=[^&]+/, `lang=${lang}`);
    } else if (currentSearch) {
      // Adaugă lang la query string existent
      newUrl += `${currentSearch}&lang=${lang}`;
    } else {
      // Creează un nou query string cu lang
      newUrl += `?lang=${lang}`;
    }
    
    // Redirecționează către noua pagină (reîncarcă pagina cu noua limbă)
    window.location.href = newUrl;
  }
}
