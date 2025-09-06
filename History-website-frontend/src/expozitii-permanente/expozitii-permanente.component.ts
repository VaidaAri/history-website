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

interface ExhibitionImage {
  id?: number;
  url?: string;
  path?: string;
  filename: string;
  description?: string;
  index: number;
}

@Component({
  selector: 'app-expozitii-permanente',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MeniuComponent, CadranComponent, TranslatePipe],
  templateUrl: './expozitii-permanente.component.html',
  styleUrl: './expozitii-permanente.component.css'
})
export class ExpozitiiPermanenteComponent implements OnInit {
  selectedSection: string = 'istorie';
  
  isAdmin: boolean = false;
  
  selectedFiles: File[] = [];
  currentUploadIndex: number = 0;
  imageDescription: string = '';
  isUploading: boolean = false;
  uploadMessage: string = '';
  showUploadMessage: boolean = false;

  constructor(
    private translationService: TranslationService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  showGallery: boolean = false;
  currentImage: ExhibitionImage | null = null;
  currentImageIndex: number = 0;
  currentImages: ExhibitionImage[] = [];
  
  zoomLevel: number = 1;
  isDragging: boolean = false;
  dragStart: { x: number, y: number } = { x: 0, y: 0 };
  imagePosition: { x: number, y: number } = { x: 0, y: 0 };
  
  isFullscreen: boolean = false;

  currentPage: number = 1;
  imagesPerPage: number = 4; 
  totalPages: number = 1;

  istorieImages: ExhibitionImage[] = [
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia istorie/IMG_9613_1_compressed.jpg',
      filename: 'IMG_9613_1_compressed.jpg',
      description: 'Expoziția permanentă de istorie - vedere generală',
      index: 0
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9616_1_compressed.jpg',
      filename: 'IMG_9616_1_compressed.jpg',
      description: 'Vitrină cu documente istorice din perioada grănicerească',
      index: 1
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9617_!_compressed.jpg',
      filename: 'IMG_9617_!_compressed.jpg',
      description: 'Colecție de arme și uniforme militare',
      index: 2
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9621_1_compressed.jpg',
      filename: 'IMG_9621_1_compressed.jpg',
      description: 'Exponate din perioada Regimentului II Românesc de Graniță',
      index: 3
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9622_1_compressed.jpg',
      filename: 'IMG_9622_1_compressed.jpg',
      description: 'Obiecte personale ale grănicerilor năsăudeni',
      index: 4
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9623_1_compressed.jpg',
      filename: 'IMG_9623_1_compressed.jpg',
      description: 'Documente și hărți istorice ale regiunii Năsăud',
      index: 5
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9624_1_compressed.jpg',
      filename: 'IMG_9624_1_compressed.jpg',
      description: 'Colecție de insigne și decorații militare',
      index: 6
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9628_1_compressed.jpg',
      filename: 'IMG_9628_1_compressed.jpg',
      description: 'Vitrină cu artefacte din perioada grănicerească',
      index: 7
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9629_1_compressed.jpg',
      filename: 'IMG_9629_1_compressed.jpg',
      description: 'Exponate dedicate personalităților marcante ale regiunii',
      index: 8
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9630_1_compressed.jpg',
      filename: 'IMG_9630_1_compressed.jpg',
      description: 'Secțiune dedicată istoriei locale năsăudene',
      index: 9
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9635_1_compressed.jpg',
      filename: 'IMG_9635_1_compressed.jpg',
      description: 'Colecție de fotografii istorice din arhiva muzeului',
      index: 10
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9636_1_compressed.jpg',
      filename: 'IMG_9636_1_compressed.jpg',
      description: 'Exponate militare din colecția permanentă',
      index: 11
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9637_1_compressed.jpg',
      filename: 'IMG_9637_1_compressed.jpg',
      description: 'Uniformele și echipamentul grănicerilor năsăudeni',
      index: 12
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9642_1_compressed.jpg',
      filename: 'IMG_9642_1_compressed.jpg',
      description: 'Documente oficiale și corespondenţă istorică',
      index: 13
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9643_!_compressed.jpg',
      filename: 'IMG_9643_!_compressed.jpg',
      description: 'Colecție de medalii și distincții de onoare',
      index: 14
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9648_1_compressed.jpg',
      filename: 'IMG_9648_1_compressed.jpg',
      description: 'Exponate din perioada de glorie a grănicerilor năsăudeni',
      index: 15
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9653_1_compressed.jpg',
      filename: 'IMG_9653_1_compressed.jpg',
      description: 'Vitrină cu obiecte comemorative și memorabile',
      index: 16
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9654_1_compressed.jpg',
      filename: 'IMG_9654_1_compressed.jpg',
      description: 'Colecție completă a expoziției permanente de istorie',
      index: 17
    },
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9655_1_compressed.jpg',
      filename: 'IMG_9655_1_compressed.jpg',
      description: 'Exponate finale din galeria de istorie a muzeului',
      index: 18
    }
  ];

  etnografieImages: ExhibitionImage[] = [
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia etnografie/IMG_9656_1_compressed.jpg',
      filename: 'IMG_9656_1_compressed.jpg',
      description: 'Expoziția de etnografie - vedere de ansamblu',
      index: 0
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9657_1.jpg',
      filename: 'IMG_9657_1.jpg',
      description: 'Costume populare tradiționale din zona Năsăud',
      index: 1
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9664_1.jpg',
      filename: 'IMG_9664_1.jpg',
      description: 'Colecție de obiecte de uz casnic tradițional',
      index: 2
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9665_1.jpg',
      filename: 'IMG_9665_1.jpg',
      description: 'Instrumente de lucru și unelte tradiționale',
      index: 3
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9666_1.jpg',
      filename: 'IMG_9666_1.jpg',
      description: 'Artizanat local și piese de meșteșug năsăudean',
      index: 4
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9667_1.jpg',
      filename: 'IMG_9667_1.jpg',
      description: 'Costume festive și îmbrăcăminte ceremonială',
      index: 5
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9670_1.jpg',
      filename: 'IMG_9670_1.jpg',
      description: 'Tradiții și obiceiuri din Țara Năsăudului',
      index: 6
    },
    {
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9671_1.jpg',
      filename: 'IMG_9671_1.jpg',
      description: 'Colecție completă de etnografie năsăudeană',
      index: 7
    }
  ];

  aerLiberImages: ExhibitionImage[] = [
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9430_1.jpg',
      filename: 'IMG_9430_1.jpg',
      description: 'Casa țărănească din Ilva Mare - vedere generală',
      index: 0
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9431_1.jpg',
      filename: 'IMG_9431_1.jpg',
      description: 'Detalii arhitecturale ale casei tradiționale',
      index: 1
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9674_1.JPG',
      filename: 'IMG_9674_1.JPG',
      description: 'Elemente decorative specifice zonei',
      index: 2
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9676_1.jpg',
      filename: 'IMG_9676_1.jpg',
      description: 'Detalii de construcție tradițională',
      index: 3
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9679_1.jpg',
      filename: 'IMG_9679_1.jpg',
      description: 'Prezentare completă a casei țărănești',
      index: 4
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9680_1.jpg',
      filename: 'IMG_9680_1.jpg',
      description: 'Elemente specifice arhitecturii locale',
      index: 5
    },
    {
      url: 'http://localhost:8080/api/staticresources/images/Sectia in aer liber/IMG_9682_1.jpg',
      filename: 'IMG_9682_1.jpg',
      description: 'Secția etnografică în aer liber',
      index: 6
    }
  ];

  switchSection(section: string) {
    this.selectedSection = section;
    this.currentPage = 1; 
    this.updatePagination();
  }

  updatePagination() {
    const totalImages = this.getCurrentSectionImages().length;
    this.totalPages = Math.ceil(totalImages / this.imagesPerPage);
  }

  getCurrentSectionImages(): ExhibitionImage[] {
    switch(this.selectedSection) {
      case 'istorie':
        return this.istorieImages;
      case 'etnografie':
        return this.etnografieImages;
      case 'aerLiber':
        return this.aerLiberImages;
      default:
        return [];
    }
  }

  getPaginatedImages(): ExhibitionImage[] {
    const allImages = this.getCurrentSectionImages();
    const startIndex = (this.currentPage - 1) * this.imagesPerPage;
    const endIndex = startIndex + this.imagesPerPage;
    return allImages.slice(startIndex, endIndex);
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

  loadDynamicImages() {
    this.http.get<any[]>('http://localhost:8080/api/images').subscribe({
      next: (images) => {
        const istorieImages = images.filter(img => 
          img.description && img.description.startsWith('EXPOZITIE_ISTORIE:')
        ).map(img => ({
          id: img.id,
          path: img.path,
          url: this.getImageUrl(img.path),
          filename: img.path,
          description: img.description.replace('EXPOZITIE_ISTORIE:', '').trim(),
          index: 0
        }));
        
        const etnografieImages = images.filter(img => 
          img.description && img.description.startsWith('EXPOZITIE_ETNOGRAFIE:')
        ).map(img => ({
          id: img.id,
          path: img.path,
          url: this.getImageUrl(img.path),
          filename: img.path,
          description: img.description.replace('EXPOZITIE_ETNOGRAFIE:', '').trim(),
          index: 0
        }));
        
        const aerLiberImages = images.filter(img => 
          img.description && img.description.startsWith('EXPOZITIE_AER_LIBER:')
        ).map(img => ({
          id: img.id,
          path: img.path,
          url: this.getImageUrl(img.path),
          filename: img.path,
          description: img.description.replace('EXPOZITIE_AER_LIBER:', '').trim(),
          index: 0
        }));

        // Păstrăm imaginile statice (fără id) și înlocuim cele dinamice  
        const staticIstorieImages = this.istorieImages.filter(img => !img.id);
        const staticEtnografieImages = this.etnografieImages.filter(img => !img.id);
        const staticAerLiberImages = this.aerLiberImages.filter(img => !img.id);
        
        this.istorieImages = [...staticIstorieImages, ...istorieImages];
        this.etnografieImages = [...staticEtnografieImages, ...etnografieImages];
        this.aerLiberImages = [...staticAerLiberImages, ...aerLiberImages];
        
        this.updatePagination();
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
    
    switch(this.selectedSection) {
      case 'istorie':
        prefix = 'EXPOZITIE_ISTORIE: ';
        break;
      case 'etnografie':
        prefix = 'EXPOZITIE_ETNOGRAFIE: ';
        break;
      case 'aerLiber':
        prefix = 'EXPOZITIE_AER_LIBER: ';
        break;
    }
    
    const formData = new FormData();
    formData.append('image', currentFile);
    formData.append('description', prefix + (description || 'Expoziție permanentă'));
    
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
          
          if (this.showGallery && this.currentImage && this.currentImage.id === imageId) {
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

  getFullscreenTitle(): string {
    return this.isFullscreen ? 'Ieși din fullscreen (F)' : 'Fullscreen (F)';
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAdmin = isAuth;
    });
    
    this.loadDynamicImages();
    this.updatePagination();
    this.setupKeyboardListeners();
  }

  setupKeyboardListeners() {
    document.addEventListener('keydown', (event) => {
      if (this.showGallery) {
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
          case 'f':
          case 'F':
            this.toggleFullscreen();
            break;
        }
      }
    });
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
    this.resetImageTransforms();
  }

  closeGallery() {
    this.showGallery = false;
    this.currentImage = null;
    this.isFullscreen = false;
    this.resetImageTransforms();
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.currentImages[this.currentImageIndex];
      this.resetImageTransforms();
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.currentImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.currentImages[this.currentImageIndex];
      this.resetImageTransforms();
    }
  }

  getCurrentImageTitle(): string {
    if (!this.currentImage) return '';
    
    const sectionTitles: { [key: string]: string } = {
      'istorie': this.translationService.translate('exhibitionsHistoryBtn'),
      'etnografie': this.translationService.translate('exhibitionsEthnographyBtn'), 
      'aerLiber': this.translationService.translate('exhibitionsOutdoorBtn')
    };
    
    return sectionTitles[this.selectedSection] || this.translationService.translate('exhibitionsPermanentTitle');
  }

  getPageInfoText(): string {
    const template = this.translationService.translate('exhibitionsPageInfo');
    return template
      .replace('{currentPage}', this.currentPage.toString())
      .replace('{totalPages}', this.totalPages.toString())
      .replace('{totalImages}', this.getCurrentSectionImages().length.toString());
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
}