import { Component, OnInit } from '@angular/core';
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
export class ExpozitiiPermanenteComponent implements OnInit {
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

  // Pagination functionality
  currentPage: number = 1;
  imagesPerPage: number = 4; // Reduce number of images per page for better performance
  totalPages: number = 1;

  // Sample images for each section - these would be loaded from backend
  istorieImages: ExhibitionImage[] = [
    {
      url: 'http://localhost:8080/images/Sectia istorie/IMG_9613_1_compressed.jpg',
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
      url: 'http://localhost:8080/images/Sectia etnografie/IMG_9656_1_compressed.jpg',
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
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9430_1.jpg',
      filename: 'IMG_9430_1.jpg',
      description: 'Casa țărănească din Ilva Mare - vedere generală',
      index: 0
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9431_1.jpg',
      filename: 'IMG_9431_1.jpg',
      description: 'Detalii arhitecturale ale casei tradiționale',
      index: 1
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9672_1.jpg',
      filename: 'IMG_9672_1.jpg',
      description: 'Secția în aer liber - perspectivă laterală',
      index: 2
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9673_1.JPG',
      filename: 'IMG_9673_1.JPG',
      description: 'Arhitectura tradițională năsăudeană',
      index: 3
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9674_1.JPG',
      filename: 'IMG_9674_1.JPG',
      description: 'Elemente decorative specifice zonei',
      index: 4
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9675_1.jpg',
      filename: 'IMG_9675_1.jpg',
      description: 'Casa din Ilva Mare - vedere din față',
      index: 5
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9676_1.jpg',
      filename: 'IMG_9676_1.jpg',
      description: 'Detalii de construcție tradițională',
      index: 6
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9677_1.jpg',
      filename: 'IMG_9677_1.jpg',
      description: 'Amenajarea curții muzeului',
      index: 7
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9678_1.jpg',
      filename: 'IMG_9678_1.jpg',
      description: 'Contextul istoric al secției în aer liber',
      index: 8
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9679_1.jpg',
      filename: 'IMG_9679_1.jpg',
      description: 'Prezentare completă a casei țărănești',
      index: 9
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9680_1.jpg',
      filename: 'IMG_9680_1.jpg',
      description: 'Elemente specifice arhitecturii locale',
      index: 10
    },
    {
      url: 'http://localhost:8080/images/Sectia in aer liber/IMG_9682_1.jpg',
      filename: 'IMG_9682_1.jpg',
      description: 'Secția etnografică în aer liber',
      index: 11
    }
  ];

  switchSection(section: string) {
    this.selectedSection = section;
    this.currentPage = 1; // Reset to first page when switching sections
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

  ngOnInit() {
    this.updatePagination();
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