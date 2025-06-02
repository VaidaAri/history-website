import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

interface ExhibitionImage {
  url: string;
  filename: string;
  description?: string;
  index: number;
}

@Component({
  selector: 'app-expozitii-permanente',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent],
  templateUrl: './expozitii-permanente.component.html',
  styleUrl: './expozitii-permanente.component.css'
})
export class ExpozitiiPermanenteComponent {
  selectedSection: string = 'istorie';

  // Gallery functionality
  showGallery: boolean = false;
  currentImage: ExhibitionImage | null = null;
  currentImageIndex: number = 0;
  currentImages: ExhibitionImage[] = [];
  
  // Zoom and drag functionality
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStart: { x: number, y: number } = { x: 0, y: 0 };
  imagePosition: { x: number, y: number } = { x: 0, y: 0 };

  // Sample images for each section - these would be loaded from backend
  istorieImages: ExhibitionImage[] = [
    {
      url: 'http://localhost:8080/images/Catana neagra.jpg',
      filename: 'Catana neagra.jpg',
      description: 'Sabie de granicer din colecția muzeului',
      index: 0
    }
    // Add more images here
  ];

  etnografieImages: ExhibitionImage[] = [
    // Add ethnography images here
  ];

  aerLiberImages: ExhibitionImage[] = [
    // Add outdoor section images here
  ];

  switchSection(section: string) {
    this.selectedSection = section;
  }

  openGallery(image: ExhibitionImage) {
    let images: ExhibitionImage[] = [];
    
    switch(this.selectedSection) {
      case 'istorie':
        images = this.istorieImages;
        break;
      case 'etnografie':
        images = this.etnografieImages;
        break;
      case 'aerLiber':
        images = this.aerLiberImages;
        break;
    }
    
    this.currentImages = images;
    this.currentImageIndex = images.findIndex(img => img.url === image.url);
    this.currentImage = image;
    this.showGallery = true;
    this.resetZoom();
  }

  closeGallery() {
    this.showGallery = false;
    this.currentImage = null;
    this.resetZoom();
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.currentImages[this.currentImageIndex];
      this.resetZoom();
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.currentImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.currentImages[this.currentImageIndex];
      this.resetZoom();
    }
  }

  getCurrentImageTitle(): string {
    if (!this.currentImage) return '';
    
    const sectionTitles: { [key: string]: string } = {
      'istorie': 'Expoziția de Istorie',
      'etnografie': 'Expoziția de Etnografie', 
      'aerLiber': 'Secția în Aer Liber'
    };
    
    return sectionTitles[this.selectedSection] || 'Expoziție Permanentă';
  }

  // Zoom functionality
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.imagePosition = { x: 0, y: 0 };
  }

  getImageStyle() {
    return {
      'transform': `scale(${this.zoomLevel}) translate(${this.imagePosition.x}px, ${this.imagePosition.y}px)`,
      'cursor': this.zoomLevel > 1 ? (this.isDragging ? 'grabbing' : 'grab') : 'default'
    };
  }

  // Drag functionality
  startDrag(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.dragStart = { x: event.clientX - this.imagePosition.x, y: event.clientY - this.imagePosition.y };
      event.preventDefault();
    }
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging && this.zoomLevel > 1) {
      this.imagePosition = {
        x: event.clientX - this.dragStart.x,
        y: event.clientY - this.dragStart.y
      };
    }
  }

  stopDrag() {
    this.isDragging = false;
  }
}