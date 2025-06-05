import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';

interface PrieteniImage {
  id?: number;
  path: string;
  description: string;
  index?: number;
}

@Component({
  selector: 'app-prietenii-muzeului',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent, FormsModule, HttpClientModule],
  templateUrl: './prietenii-muzeului.component.html',
  styleUrl: './prietenii-muzeului.component.css'
})
export class PrieteniiMuzeuluiComponent implements OnInit {
  // Array cu imagini despre prietenii muzeului
  prieteniImages: PrieteniImage[] = [];
  
  // Proprietăți pentru administrare
  isAdmin: boolean = false;
  
  // Proprietăți pentru încărcare
  selectedFiles: File[] = [];
  currentUploadIndex: number = 0;
  imageDescription: string = 'Momentele frumoase cu prietenii muzeului';  // Valoare implicită
  isUploading: boolean = false;
  uploadMessage: string = '';
  showUploadMessage: boolean = false;
  
  // Gallery functionality
  showGallery: boolean = false;
  currentImage: PrieteniImage | null = null;
  currentModalImageIndex: number = 0;
  
  // Zoom and drag functionality
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStart: { x: number, y: number } = { x: 0, y: 0 };
  imagePosition: { x: number, y: number } = { x: 0, y: 0 };
  
  // Fullscreen functionality
  isFullscreen: boolean = false;

  // Pagination functionality
  currentPage: number = 1;
  imagesPerPage: number = 4;
  totalPages: number = 1;
  
  // Proprietăți pentru galeria clasică (păstrate pentru compatibilitate)
  currentImageIndex: number = 0;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    // Verifică dacă utilizatorul este administrator
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAdmin = isAuth;
    });
    
    // Încarcă imaginile existente
    this.loadImages();
    this.setupKeyboardListeners();
  }
  
  // Încarcă imaginile din backend
  loadImages() {
    this.http.get<PrieteniImage[]>('http://localhost:8080/api/images').subscribe({
      next: (images) => {
        // Filtrăm doar imaginile pentru prietenii muzeului (cele care au description ce începe cu "PRIETENI:")
        this.prieteniImages = images.filter(img => 
          img.description && img.description.startsWith('PRIETENI:')
        ).map(img => ({
          ...img,
          description: img.description.replace('PRIETENI:', '').trim()
        }));
        
        // Resetăm indexul imaginii curente dacă e cazul
        if (this.prieteniImages.length > 0 && this.currentImageIndex >= this.prieteniImages.length) {
          this.currentImageIndex = 0;
        }
        
        this.updatePagination();
      },
      error: (err) => {
        console.error('Eroare la încărcarea imaginilor:', err);
      }
    });
  }
  
  // Metoda pentru a construi URL-ul imaginii
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:8080/api/images/uploads/${imagePath}`;
  }
  
  // Selectează fișiere pentru încărcare
  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    console.log('Fișiere selectate:', files.length, files);
    if (files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...files];
      console.log('Total fișiere în listă:', this.selectedFiles.length);
    }
    
    // Reset input field
    event.target.value = '';
  }
  
  // Elimină un fișier din lista de fișiere selectate
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  
  // Încarcă toate imaginile selectate
  uploadImages() {
    console.log('uploadImages apelat, fișiere selectate:', this.selectedFiles.length);
    if (this.selectedFiles.length === 0) {
      this.showUploadMessage = true;
      this.uploadMessage = 'Selectați cel puțin un fișier pentru încărcare.';
      setTimeout(() => this.showUploadMessage = false, 3000);
      return;
    }
    
    this.isUploading = true;
    this.currentUploadIndex = 0;
    console.log('Începe încărcarea fișierelor...');
    this.uploadNextImage();
  }
  
  // Încarcă următoarea imagine din listă
  private uploadNextImage() {
    if (this.currentUploadIndex >= this.selectedFiles.length) {
      // Toate imaginile au fost încărcate
      this.showUploadMessage = true;
      this.uploadMessage = `Toate imaginile (${this.selectedFiles.length}) au fost încărcate cu succes!`;
      setTimeout(() => this.showUploadMessage = false, 3000);
      this.selectedFiles = [];
      this.imageDescription = 'Momentele frumoase cu prietenii muzeului';
      this.isUploading = false;
      this.currentUploadIndex = 0;
      this.loadImages();
      return;
    }
    
    const currentFile = this.selectedFiles[this.currentUploadIndex];
    
    // Folosim valoarea implicită dacă nu este completată
    const description = this.imageDescription.trim() 
      ? this.imageDescription 
      : 'Momentele frumoase cu prietenii muzeului';
    
    const formData = new FormData();
    formData.append('image', currentFile);
    formData.append('description', 'PRIETENI: ' + description);
    
    this.http.post('http://localhost:8080/api/images/upload-image', formData).subscribe({
      next: () => {
        this.currentUploadIndex++;
        this.uploadNextImage();
      },
      error: (err) => {
        console.error(`Eroare la încărcarea imaginii ${this.currentUploadIndex + 1}:`, err);
        this.showUploadMessage = true;
        this.uploadMessage = `Eroare la încărcarea imaginii ${currentFile.name}. Încarcările s-au oprit.`;
        setTimeout(() => this.showUploadMessage = false, 5000);
        this.isUploading = false;
        this.currentUploadIndex = 0;
      }
    });
  }
  
  // Șterge o imagine
  deleteImage(imageId: number | undefined) {
    if (!imageId) return;
    
    if (confirm('Sigur doriți să ștergeți această imagine?')) {
      this.http.delete(`http://localhost:8080/api/images/${imageId}`).subscribe({
        next: () => {
          this.showUploadMessage = true;
          this.uploadMessage = 'Imaginea a fost ștearsă cu succes!';
          setTimeout(() => this.showUploadMessage = false, 3000);
          
          // Dacă am șters ultima imagine și indexul curent este acum invalid
          if (this.currentImageIndex >= this.prieteniImages.length - 1) {
            this.currentImageIndex = Math.max(0, this.prieteniImages.length - 2);
          }
          
          // Dacă ștergem imaginea curentă din modal, închidem modalul
          if (this.showGallery && this.currentImage && this.currentImage.id === imageId) {
            this.closeGallery();
          }
          
          this.loadImages();
        },
        error: (err) => {
          console.error('Eroare la ștergerea imaginii:', err);
          this.showUploadMessage = true;
          this.uploadMessage = 'A apărut o eroare la ștergerea imaginii.';
          setTimeout(() => this.showUploadMessage = false, 3000);
        }
      });
    }
  }
  
  // Navigare la imaginea anterioară
  prevImage() {
    if (this.prieteniImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.prieteniImages.length) % this.prieteniImages.length;
  }
  
  // Navigare la imaginea următoare
  nextImage() {
    if (this.prieteniImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.prieteniImages.length;
  }
  
  // Setează imaginea curentă (pentru thumbnail-uri)
  setCurrentImage(index: number) {
    if (index >= 0 && index < this.prieteniImages.length) {
      this.currentImageIndex = index;
    }
  }
  
  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.prieteniImages.length / this.imagesPerPage);
  }

  getPaginatedImages(): PrieteniImage[] {
    const startIndex = (this.currentPage - 1) * this.imagesPerPage;
    const endIndex = startIndex + this.imagesPerPage;
    return this.prieteniImages.slice(startIndex, endIndex);
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
  
  // Gallery modal methods
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

  openGallery(image: PrieteniImage) {
    this.currentModalImageIndex = this.prieteniImages.findIndex(img => img.path === image.path);
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
      this.currentImage = this.prieteniImages[this.currentModalImageIndex];
      this.resetImageTransforms();
    }
  }

  nextModalImage() {
    if (this.currentModalImageIndex < this.prieteniImages.length - 1) {
      this.currentModalImageIndex++;
      this.currentImage = this.prieteniImages[this.currentModalImageIndex];
      this.resetImageTransforms();
    }
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

  // Fullscreen functionality
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