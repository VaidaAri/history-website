import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postare.component.html',
  styleUrl: './postare.component.css'
})
export class PostareComponent {
  @Input() post: any;
  
  // Metoda pentru a construi URL-ul pentru imaginea de pe server
  getImageUrl(imagePath: string): string {
    // Verificăm dacă imagePath este definit
    if (!imagePath) {
      return '';
    }
    
    // Verificăm dacă imagePath este deja un URL complet
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Altfel construim URL-ul pentru imaginea de pe server
    return `http://localhost:8080/api/images/uploads/${imagePath}`;
  }
}
