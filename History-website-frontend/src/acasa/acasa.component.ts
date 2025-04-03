import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { ImagineComponent } from '../imagine/imagine.component';
import { PostareComponent } from '../postare/postare.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from "../cadran/cadran.component";

@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [
    RouterModule,
    MeniuComponent,
    ImagineComponent,
    PostareComponent,
    CadranComponent,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent implements OnInit {
  posts: any[] = [];
  description: string = '';
  imageUrl: string = '';
  images: any[] = [];
  isAdmin: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Verificăm dacă utilizatorul este admin la fiecare încărcare a paginii
    this.checkAdminStatus();
    this.loadPosts();
  }

  // Verifică dacă există token de administrator
  checkAdminStatus() {
    this.isAdmin = !!localStorage.getItem('adminToken');
  }

  // Încarcă toate postările din backend
  loadPosts() {
    this.http.get<any[]>('http://localhost:8080/api/posts').subscribe({
      next: (data) => {
        this.posts = data;
        // Sortare postări - cele mai noi primele
        this.posts.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },
      error: (err) => {
        console.error('Eroare la încărcarea postărilor:', err);
      }
    });
  }

  // Elimină o imagine din lista de imagini selectate
  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  // Gestionează selecția de fișiere
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verifică dacă fișierul este o imagine
        if (file.type.match(/image\/*/) == null) {
          alert('Doar fișierele de tip imagine sunt permise!');
          continue;
        }
        
        // Limitează numărul de imagini la 5 per postare
        if (this.images.length >= 5) {
          alert('Poți adăuga maxim 5 imagini la o postare.');
          break;
        }
        
        // Citește fișierul și adaugă-l la lista de imagini
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.images.push({
            url: reader.result as string,
            file: file
          });
        };
      }
    }
    
    // Resetează input-ul pentru a permite reîncărcarea aceluiași fișier
    event.target.value = '';
  }

  // Creează o postare nouă
  createPost() {
    if (!this.description.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }

    // Verificăm din nou dacă utilizatorul este autentificat
    if (!this.isAdmin) {
      alert('Trebuie să fiți autentificat ca administrator pentru a crea o postare!');
      return;
    }

    const newPost = { 
      description: this.description, 
      images: this.images,
      createdAt: new Date().toISOString()
    };

    this.http.post('http://localhost:8080/api/posts', newPost).subscribe({
      next: () => {
        alert('Postare adăugată cu succes!');
        this.description = '';
        this.images = [];
        this.loadPosts();
      },
      error: (err) => {
        console.error('Eroare la crearea postării:', err);
        alert('A apărut o eroare la crearea postării. Vă rugăm să încercați din nou.');
      }
    });
  }

  // Șterge o postare
  deletePost(id: number) {
    if (!this.isAdmin) {
      alert('Trebuie să fiți autentificat ca administrator pentru a șterge o postare!');
      return;
    }

    if (confirm('Sigur doriți să ștergeți această postare?')) {
      this.http.delete(`http://localhost:8080/api/posts/${id}`).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (err) => {
          console.error('Eroare la ștergerea postării:', err);
          alert('A apărut o eroare la ștergerea postării.');
        }
      });
    }
  }
}
