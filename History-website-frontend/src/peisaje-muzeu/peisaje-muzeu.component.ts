import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

interface PeisajImage {
  id?: number;
  path: string;
  description: string;
  index?: number;
}

@Component({
  selector: 'app-peisaje-muzeu',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent, FormsModule, TranslatePipe],
  templateUrl: './peisaje-muzeu.component.html',
  styleUrl: './peisaje-muzeu.component.css'
})
export class PeisajeMuzeuComponent implements OnInit {
  peisajeImages: PeisajImage[] = [];
  
  isAdmin: boolean = false;
  
  selectedFiles: File[] = [];
  currentUploadIndex: number = 0;
  imageDescription: string = 'Peisaj din curtea muzeului';
  isUploading: boolean = false;
  uploadMessage: string = '';
  showUploadMessage: boolean = false;
  
  showGallery: boolean = false;
  currentImage: PeisajImage | null = null;
  currentModalImageIndex: number = 0;
  
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStart: { x: number, y: number } = { x: 0, y: 0 };
  imagePosition: { x: number, y: number } = { x: 0, y: 0 };
  
  isFullscreen: boolean = false;

  currentPage: number = 1;
  imagesPerPage: number = 4;
  totalPages: number = 1;
  
  currentImageIndex: number = 0;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAdmin = isAuth;
    });
    
    this.loadImages();
    this.setupKeyboardListeners();
    
    setTimeout(() => {
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) {
        // Input validation logic can be added here if needed
      }
    }, 1000);
  }
  
  loadImages() {
    this.http.get<PeisajImage[]>('http://localhost:8080/api/images').subscribe({
      next: (images) => {
        this.peisajeImages = images.filter(img => 
          img.description && img.description.startsWith('PEISAJ:')
        ).map(img => ({
          ...img,
          description: img.description.replace('PEISAJ:', '').trim()
        }));
        
        if (this.peisajeImages.length > 0 && this.currentImageIndex >= this.peisajeImages.length) {
          this.currentImageIndex = 0;
        }
        
        this.updatePagination();
      },
      error: (err) => {
        // Error handling for image loading can be implemented here
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
      this.selectedFiles = [...this.selectedFiles, ...files];
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
      this.imageDescription = 'Peisaj din curtea muzeului';
      this.isUploading = false;
      this.currentUploadIndex = 0;
      this.loadImages();
      return;
    }
    
    const currentFile = this.selectedFiles[this.currentUploadIndex];
    
    const description = this.imageDescription.trim() 
      ? this.imageDescription 
      : 'Peisaj din curtea muzeului';
    
    const formData = new FormData();
    formData.append('image', currentFile);
    formData.append('description', 'PEISAJ: ' + description);
    
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
          
          if (this.currentImageIndex >= this.peisajeImages.length - 1) {
            this.currentImageIndex = Math.max(0, this.peisajeImages.length - 2);
          }
          
          if (this.showGallery && this.currentImage && this.currentImage.id === imageId) {
            this.closeGallery();
          }
          
          this.loadImages();
        },
        error: (err) => {
          this.showUploadMessage = true;
          this.uploadMessage = 'A apărut o eroare la ștergerea imaginii.';
          setTimeout(() => this.showUploadMessage = false, 3000);
        }
      });
    }
  }
  
  prevImage() {
    if (this.peisajeImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.peisajeImages.length) % this.peisajeImages.length;
  }
  
  nextImage() {
    if (this.peisajeImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.peisajeImages.length;
  }
  
  setCurrentImage(index: number) {
    if (index >= 0 && index < this.peisajeImages.length) {
      this.currentImageIndex = index;
    }
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.peisajeImages.length / this.imagesPerPage);
  }

  getPaginatedImages(): PeisajImage[] {
    const startIndex = (this.currentPage - 1) * this.imagesPerPage;
    const endIndex = startIndex + this.imagesPerPage;
    return this.peisajeImages.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
  
  setupKeyboardListeners() {
    document.addEventListener('keydown', (event) => {
      if (this.showGallery) {
        switch(event.key) {
          case 'ArrowLeft':
            this.prevModalImage();
            break;
          case 'ArrowRight':
            this.nextModalImage();
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
          case 'f':
          case 'F':
            this.toggleFullscreen();
            break;
        }
      }
    });
  }

  openGallery(image: PeisajImage) {
    this.currentModalImageIndex = this.peisajeImages.findIndex(img => img.path === image.path);
    this.currentImage = image;
    this.showGallery = true;
    this.resetImageTransforms();
  }

  closeGallery() {
    this.showGallery = false;
    this.currentImage = null;
    this.isFullscreen = false;
    this.resetImageTransforms();
  }

  prevModalImage() {
    if (this.currentModalImageIndex > 0) {
      this.currentModalImageIndex--;
      this.currentImage = this.peisajeImages[this.currentModalImageIndex];
      this.resetImageTransforms();
    }
  }

  nextModalImage() {
    if (this.currentModalImageIndex < this.peisajeImages.length - 1) {
      this.currentModalImageIndex++;
      this.currentImage = this.peisajeImages[this.currentModalImageIndex];
      this.resetImageTransforms();
    }
  }

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

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  resetImageTransforms() {
    this.resetZoom();
  }

  getImageStyle() {
    return {
      'transform': `scale(${this.zoomLevel}) translate(${this.imagePosition.x}px, ${this.imagePosition.y}px)`,
      'cursor': this.zoomLevel > 1 ? (this.isDragging ? 'grabbing' : 'grab') : 'default',
      'transition': this.isDragging ? 'none' : 'transform 0.3s ease'
    };
  }

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

  getSelectedFilesText(): string {
    const template = this.translationService.translate('landscapesSelectedFiles');
    return template.replace('{count}', this.selectedFiles.length.toString());
  }

  getUploadButtonText(): string {
    const template = this.translationService.translate('landscapesUploadImages');
    return template.replace('{count}', this.selectedFiles.length.toString());
  }

  getUploadingText(): string {
    const template = this.translationService.translate('landscapesUploading');
    return template
      .replace('{current}', (this.currentUploadIndex + 1).toString())
      .replace('{total}', this.selectedFiles.length.toString());
  }

  getPageInfoText(): string {
    const template = this.translationService.translate('landscapesPageInfo');
    return template
      .replace('{currentPage}', this.currentPage.toString())
      .replace('{totalPages}', this.totalPages.toString());
  }
}