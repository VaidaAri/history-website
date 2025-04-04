import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postare.component.html',
  styleUrl: './postare.component.css'
})
export class PostareComponent implements OnInit {
  @Input() post: any;
  currentImageIndex: number = 0;
  
  ngOnInit() {
    // Inițializări
    this.currentImageIndex = 0;
  }
  
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
  
  // Navigare în carusel
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
  
  nextImage() {
    if (this.post.images && this.currentImageIndex < this.post.images.length - 1) {
      this.currentImageIndex++;
    }
  }
  
  goToImage(index: number) {
    if (this.post.images && index >= 0 && index < this.post.images.length) {
      this.currentImageIndex = index;
    }
  }
  
  // Deschide imaginea în fereastră nouă pentru vizualizare completă
  openFullImage(image: any) {
    const url = this.getImageUrl(image.path);
    window.open(url, '_blank');
  }
}
