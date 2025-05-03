import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meniu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './meniu.component.html',
  styleUrl: './meniu.component.css'
})
export class MeniuComponent {
  selectedLanguage: string = 'ro';
  
  /**
   * Schimbă limba selectată și actualizează interfața
   * Funcționalitatea completă va fi implementată ulterior
   */
  changeLanguage(lang: string): void {
    this.selectedLanguage = lang;
    console.log(`Limba a fost schimbată în: ${lang}`);
    // Funcționalitatea pentru internaționalizare va fi implementată mai târziu
  }
}
