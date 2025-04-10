import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PublicationImage {
  url: string;
  folder: string;
  filename: string;
  index: number;
}

@Component({
  selector: 'app-publicatii',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, CommonModule],
  templateUrl: './publicatii.component.html',
  styleUrl: './publicatii.component.css'
})
export class PublicatiiComponent implements OnInit {
  arhivaSomesanaImages: PublicationImage[] = [];
  scanCopertiImages: PublicationImage[] = [];
  selectedCategory: string = 'arhivaSomesana';
  apiBaseUrl = 'http://localhost:8080/api/staticresources';
  
  // Proprietăți pentru galerie
  showGallery: boolean = false;
  currentImageIndex: number = 0;
  currentImages: PublicationImage[] = [];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadArhivaSomesanaImages();
    this.loadScanCopertiImages();
  }
  
  loadArhivaSomesanaImages() {
    // Imaginile sunt de la img100.jpg până la img178.jpg
    const folderName = 'Coperti Arhiva Somesana';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 100; i <= 178; i++) {
      const filename = `img${i}.jpg`;
      const encodedFilename = encodeURIComponent(filename);
      this.arhivaSomesanaImages.push({
        url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedFilename}`,
        folder: folderName,
        filename: filename,
        index: i - 100
      });
    }
    // Adăugăm și coperta
    const copertaFilename = 'coperta arhiva somesana 2023-0.jpg';
    const encodedCopertaFilename = encodeURIComponent(copertaFilename);
    this.arhivaSomesanaImages.unshift({
      url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedCopertaFilename}`,
      folder: folderName,
      filename: copertaFilename,
      index: -1
    });
  }
  
  loadScanCopertiImages() {
    // Imaginile sunt de la scan001.jpg până la scan023.jpg
    const folderName = 'Scan coperti';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 1; i <= 23; i++) {
      const filename = `scan${i.toString().padStart(3, '0')}.jpg`;
      const encodedFilename = encodeURIComponent(filename);
      this.scanCopertiImages.push({
        url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedFilename}`,
        folder: folderName,
        filename: filename,
        index: i - 1
      });
    }
  }
  
  switchCategory(category: string) {
    this.selectedCategory = category;
    this.showGallery = false;
  }
  
  // Funcții pentru galerie
  openGallery(image: PublicationImage) {
    this.currentImages = this.selectedCategory === 'arhivaSomesana' 
      ? this.arhivaSomesanaImages 
      : this.scanCopertiImages;
    
    this.currentImageIndex = this.currentImages.findIndex(img => 
      img.folder === image.folder && img.filename === image.filename);
    
    this.showGallery = true;
  }
  
  closeGallery() {
    this.showGallery = false;
  }
  
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      // Rulează de la ultimul la primul
      this.currentImageIndex = this.currentImages.length - 1;
    }
  }
  
  nextImage() {
    if (this.currentImageIndex < this.currentImages.length - 1) {
      this.currentImageIndex++;
    } else {
      // Rulează de la primul la ultimul
      this.currentImageIndex = 0;
    }
  }
  
  // Ascultă evenimentele de tastatură pentru navigare
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showGallery) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'Escape':
        this.closeGallery();
        break;
    }
  }
  
  // Obține imaginea curentă din galerie
  get currentImage(): PublicationImage | null {
    if (this.currentImages && this.currentImages.length > 0) {
      return this.currentImages[this.currentImageIndex];
    }
    return null;
  }
  
  // Obține titlul imaginii curente
  getCurrentImageTitle(): string {
    const img = this.currentImage;
    if (img) {
      if (this.selectedCategory === 'arhivaSomesana') {
        return img.index >= 0 
          ? `Arhiva Someșană - Pagina ${img.index + 1}` 
          : 'Arhiva Someșană - Coperta';
      } else {
        return `Revista ${img.index + 1}`;
      }
    }
    return '';
  }
}
