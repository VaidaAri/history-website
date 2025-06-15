import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

interface PublicationImage {
  url: string;
  folder: string;
  filename: string;
  index: number;
}

@Component({
  selector: 'app-publicatii',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, CommonModule, TranslatePipe],
  templateUrl: './publicatii.component.html',
  styleUrl: './publicatii.component.css',
  providers: [TranslationService]
})
export class PublicatiiComponent implements OnInit {
  arhivaSomesanaImages: PublicationImage[] = [];
  scanCopertiImages: PublicationImage[] = [];
  selectedCategory: string = 'arhivaSomesana';
  apiBaseUrl = 'http://localhost:8080/api/staticresources';
  
  showGallery: boolean = false;
  currentImageIndex: number = 0;
  currentImages: PublicationImage[] = [];
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  imageTranslateX: number = 0;
  imageTranslateY: number = 0;
  
  constructor(private http: HttpClient, public translationService: TranslationService) {}
  
  ngOnInit() {
    this.loadArhivaSomesanaImages();
    this.loadScanCopertiImages();
  }
  
  loadArhivaSomesanaImages() {
    const folderName = 'Coperti Arhiva Somesana';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 100; i <= 108; i++) {
      const filename = `img${i}.jpg`;
      const encodedFilename = encodeURIComponent(filename);
      this.arhivaSomesanaImages.push({
        url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedFilename}`,
        folder: folderName,
        filename: filename,
        index: i - 100
      });
    }
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
    const folderName = 'Scan coperti';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 1; i <= 10; i++) {
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
  
  openGallery(image: PublicationImage) {
    this.currentImages = this.selectedCategory === 'arhivaSomesana' 
      ? this.arhivaSomesanaImages 
      : this.scanCopertiImages;
    
    this.currentImageIndex = this.currentImages.findIndex(img => 
      img.folder === image.folder && img.filename === image.filename);
    
    this.resetZoomAndPosition();
    this.showGallery = true;
  }
  
  closeGallery() {
    this.showGallery = false;
  }
  
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.currentImages.length - 1;
    }
    this.resetZoomAndPosition();
  }
  
  nextImage() {
    if (this.currentImageIndex < this.currentImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
    this.resetZoomAndPosition();
  }
  
  resetZoomAndPosition() {
    this.zoomLevel = 1;
    this.imageTranslateX = 0;
    this.imageTranslateY = 0;
  }
  
  zoomIn() {
    if (this.zoomLevel < 5) {
      this.zoomLevel += 0.2;
    }
  }
  
  zoomOut() {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.2;
    }
    
    if (this.zoomLevel <= 1) {
      this.imageTranslateX = 0;
      this.imageTranslateY = 0;
    }
  }
  
  resetZoom() {
    this.resetZoomAndPosition();
  }
  
  startDrag(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.imageTranslateX;
      this.dragStartY = event.clientY - this.imageTranslateY;
    }
  }
  
  onDrag(event: MouseEvent) {
    if (this.isDragging && this.zoomLevel > 1) {
      this.imageTranslateX = event.clientX - this.dragStartX;
      this.imageTranslateY = event.clientY - this.dragStartY;
      
      const maxTranslate = 200 * this.zoomLevel;
      this.imageTranslateX = Math.max(Math.min(this.imageTranslateX, maxTranslate), -maxTranslate);
      this.imageTranslateY = Math.max(Math.min(this.imageTranslateY, maxTranslate), -maxTranslate);
    }
  }
  
  stopDrag() {
    this.isDragging = false;
  }
  
  getImageStyle() {
    return {
      'transform': `scale(${this.zoomLevel}) translate(${this.imageTranslateX / this.zoomLevel}px, ${this.imageTranslateY / this.zoomLevel}px)`,
      'cursor': this.zoomLevel > 1 ? 'move' : 'default',
      'transition': this.isDragging ? 'none' : 'transform 0.2s ease'
    };
  }
  
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
      case '+':
      case '=':
        this.zoomIn();
        break;
      case '-':
        this.zoomOut();
        break;
      case '0':
        this.resetZoom();
        break;
    }
  }
  
  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (!this.showGallery) return;
    
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }
  
  get currentImage(): PublicationImage | null {
    if (this.currentImages && this.currentImages.length > 0) {
      return this.currentImages[this.currentImageIndex];
    }
    return null;
  }
  
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
