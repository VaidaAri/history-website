import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';
import { AuthService } from '../services/auth.service';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

interface PublicationImage {
  id?: number;
  url?: string;
  path?: string;
  folder?: string;
  filename: string;
  description?: string;
  index: number;
}

@Component({
  selector: 'app-publicatii',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, CommonModule, FormsModule, TranslatePipe, MeniuComponent, CadranComponent],
  templateUrl: './publicatii.component.html',
  styleUrl: './publicatii.component.css',
  providers: [TranslationService]
})
export class PublicatiiComponent implements OnInit {
  arhivaSomesanaImages: PublicationImage[] = [];
  scanCopertiImages: PublicationImage[] = [];
  selectedCategory: string = 'arhivaSomesana';
  apiBaseUrl = 'http://localhost:8080/api/staticresources';
  
  isAdmin: boolean = false;
  
  selectedFiles: File[] = [];
  currentUploadIndex: number = 0;
  imageDescription: string = '';
  isUploading: boolean = false;
  uploadMessage: string = '';
  showUploadMessage: boolean = false;
  
  showGallery: boolean = false;
  currentImageIndex: number = 0;
  currentImages: PublicationImage[] = [];
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  imageTranslateX: number = 0;
  imageTranslateY: number = 0;
  
  isFullscreen: boolean = false;
  
  constructor(private http: HttpClient, public translationService: TranslationService, private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAdmin = isAuth;
    });
    
    this.loadArhivaSomesanaImages();
    this.loadScanCopertiImages();
    this.loadDynamicImages();
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

  loadDynamicImages() {
    this.http.get<any[]>('http://localhost:8080/api/images').subscribe({
      next: (images) => {
        const arhivaSomesanaImages = images.filter(img => 
          img.description && img.description.startsWith('PUBLICATIE_ARHIVA_SOMESANA:')
        ).map(img => ({
          id: img.id,
          path: img.path,
          url: this.getImageUrl(img.path),
          filename: img.path,
          description: img.description.replace('PUBLICATIE_ARHIVA_SOMESANA:', '').trim(),
          index: 0
        }));
        
        const scanCopertiImages = images.filter(img => 
          img.description && img.description.startsWith('PUBLICATIE_SCAN_COPERTI:')
        ).map(img => ({
          id: img.id,
          path: img.path,
          url: this.getImageUrl(img.path),
          filename: img.path,
          description: img.description.replace('PUBLICATIE_SCAN_COPERTI:', '').trim(),
          index: 0
        }));

        const staticArhivaSomesanaImages = this.arhivaSomesanaImages.filter(img => !img.id);
        const staticScanCopertiImages = this.scanCopertiImages.filter(img => !img.id);
        
        this.arhivaSomesanaImages = [...staticArhivaSomesanaImages, ...arhivaSomesanaImages];
        this.scanCopertiImages = [...staticScanCopertiImages, ...scanCopertiImages];
      },
      error: (err) => {
        // Error handling can be added here
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:8080/api/images/uploads/${imagePath}`;
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      files.forEach((file: File) => {
        if (file.size > maxSizeInBytes) {
          invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        } else {
          validFiles.push(file);
        }
      });
      
      if (invalidFiles.length > 0) {
        this.showUploadMessage = true;
        this.uploadMessage = `Următoarele fișiere depășesc limita de ${maxSizeInMB}MB și nu vor fi încărcate: ${invalidFiles.join(', ')}`;
        setTimeout(() => this.showUploadMessage = false, 5000);
      }
      
      if (validFiles.length > 0) {
        this.selectedFiles = [...this.selectedFiles, ...validFiles];
      }
    }
    
    event.target.value = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  uploadImages() {
    if (this.selectedFiles.length === 0) {
      this.showUploadMessage = true;
      this.uploadMessage = 'Selectați cel puțin un fișier pentru încărcare.';
      setTimeout(() => this.showUploadMessage = false, 3000);
      return;
    }
    
    this.isUploading = true;
    this.currentUploadIndex = 0;
    this.uploadNextImage();
  }

  private uploadNextImage() {
    if (this.currentUploadIndex >= this.selectedFiles.length) {
      this.showUploadMessage = true;
      this.uploadMessage = `Toate imaginile (${this.selectedFiles.length}) au fost încărcate cu succes!`;
      setTimeout(() => this.showUploadMessage = false, 3000);
      this.selectedFiles = [];
      this.imageDescription = '';
      this.isUploading = false;
      this.currentUploadIndex = 0;
      this.loadDynamicImages();
      return;
    }
    
    const currentFile = this.selectedFiles[this.currentUploadIndex];
    
    const description = this.imageDescription.trim();
    let prefix = '';
    
    switch(this.selectedCategory) {
      case 'arhivaSomesana':
        prefix = 'PUBLICATIE_ARHIVA_SOMESANA: ';
        break;
      case 'scanCoperti':
        prefix = 'PUBLICATIE_SCAN_COPERTI: ';
        break;
    }
    
    const formData = new FormData();
    formData.append('image', currentFile);
    formData.append('description', prefix + (description || 'Publicație'));
    
    this.http.post('http://localhost:8080/api/images/upload-image', formData).subscribe({
      next: () => {
        this.currentUploadIndex++;
        this.uploadNextImage();
      },
      error: (err) => {
        this.showUploadMessage = true;
        this.uploadMessage = `Eroare la încărcarea imaginii ${currentFile.name}. Încarcările s-au oprit.`;
        setTimeout(() => this.showUploadMessage = false, 5000);
        this.isUploading = false;
        this.currentUploadIndex = 0;
      }
    });
  }

  deleteImage(imageId: number | undefined) {
    if (!imageId) return;
    
    if (confirm('Sigur doriți să ștergeți această imagine?')) {
      this.http.delete(`http://localhost:8080/api/images/${imageId}`).subscribe({
        next: () => {
          this.showUploadMessage = true;
          this.uploadMessage = 'Imaginea a fost ștearsă cu succes!';
          setTimeout(() => this.showUploadMessage = false, 3000);
          
          if (this.showGallery && this.currentImages[this.currentImageIndex] && this.currentImages[this.currentImageIndex].id === imageId) {
            this.closeGallery();
          }
          
          this.loadDynamicImages();
        },
        error: (err) => {
          this.showUploadMessage = true;
          this.uploadMessage = 'A apărut o eroare la ștergerea imaginii.';
          setTimeout(() => this.showUploadMessage = false, 3000);
        }
      });
    }
  }

  getSelectedFilesText(): string {
    const template = this.translationService.translate('landscapesSelectedFiles') || 'Fișiere selectate: {count}';
    return template.replace('{count}', this.selectedFiles.length.toString());
  }

  getUploadButtonText(): string {
    const template = this.translationService.translate('landscapesUploadImages') || 'Încarcă {count} imagini';
    return template.replace('{count}', this.selectedFiles.length.toString());
  }

  getUploadingText(): string {
    const template = this.translationService.translate('landscapesUploading') || 'Se încarcă {current}/{total}...';
    return template
      .replace('{current}', (this.currentUploadIndex + 1).toString())
      .replace('{total}', this.selectedFiles.length.toString());
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}
