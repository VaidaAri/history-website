import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';

interface PeisajImage {
  id?: number;
  path: string;
  description: string;
}

@Component({
  selector: 'app-peisaje-muzeu',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent, FormsModule, HttpClientModule],
  templateUrl: './peisaje-muzeu.component.html',
  styleUrl: './peisaje-muzeu.component.css'
})
export class PeisajeMuzeuComponent implements OnInit {
  // Array cu imagini din curtea muzeului
  peisajeImages: PeisajImage[] = [];
  
  // Proprietăți pentru administrare
  isAdmin: boolean = false;
  
  // Proprietăți pentru încărcare
  selectedFile: File | null = null;
  imageDescription: string = 'Peisaj din curtea muzeului';  // Valoare implicită
  isUploading: boolean = false;
  uploadMessage: string = '';
  showUploadMessage: boolean = false;
  
  // Proprietăți pentru galeria clasică
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
  }
  
  // Încarcă imaginile din backend
  loadImages() {
    this.http.get<PeisajImage[]>('http://localhost:8080/api/images').subscribe({
      next: (images) => {
        // Filtrăm doar imaginile pentru peisaje (cele care au description ce începe cu "PEISAJ:")
        this.peisajeImages = images.filter(img => 
          img.description && img.description.startsWith('PEISAJ:')
        ).map(img => ({
          ...img,
          description: img.description.replace('PEISAJ:', '').trim()
        }));
        
        // Resetăm indexul imaginii curente dacă e cazul
        if (this.peisajeImages.length > 0 && this.currentImageIndex >= this.peisajeImages.length) {
          this.currentImageIndex = 0;
        }
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
  
  // Selectează un fișier pentru încărcare
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
    
    // Reset input field
    event.target.value = '';
  }
  
  // Încarcă imaginea selectată
  uploadImage() {
    if (!this.selectedFile) {
      this.showUploadMessage = true;
      this.uploadMessage = 'Selectați un fișier pentru încărcare.';
      setTimeout(() => this.showUploadMessage = false, 3000);
      return;
    }
    
    // Folosim valoarea implicită dacă nu este completată
    const description = this.imageDescription.trim() 
      ? this.imageDescription 
      : 'Peisaj din curtea muzeului';
    
    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('description', 'PEISAJ: ' + description);
    
    this.http.post('http://localhost:8080/api/images/upload-image', formData).subscribe({
      next: () => {
        this.showUploadMessage = true;
        this.uploadMessage = 'Imaginea a fost încărcată cu succes!';
        setTimeout(() => this.showUploadMessage = false, 3000);
        this.selectedFile = null;
        this.imageDescription = 'Peisaj din curtea muzeului';  // Resetăm la valoarea implicită
        this.isUploading = false;
        this.loadImages();
      },
      error: (err) => {
        console.error('Eroare la încărcarea imaginii:', err);
        this.showUploadMessage = true;
        this.uploadMessage = 'A apărut o eroare la încărcarea imaginii.';
        setTimeout(() => this.showUploadMessage = false, 3000);
        this.isUploading = false;
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
          if (this.currentImageIndex >= this.peisajeImages.length - 1) {
            this.currentImageIndex = Math.max(0, this.peisajeImages.length - 2);
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
    if (this.peisajeImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.peisajeImages.length) % this.peisajeImages.length;
  }
  
  // Navigare la imaginea următoare
  nextImage() {
    if (this.peisajeImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.peisajeImages.length;
  }
  
  // Setează imaginea curentă (pentru thumbnail-uri)
  setCurrentImage(index: number) {
    if (index >= 0 && index < this.peisajeImages.length) {
      this.currentImageIndex = index;
    }
  }
}