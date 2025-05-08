import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { PostareComponent } from '../postare/postare.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from "../cadran/cadran.component";
import { PostManagerComponent } from '../components/post-manager/post-manager.component';
import { PostEditorComponent } from '../components/post-editor/post-editor.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

// Interfață pentru secțiune
interface Section {
  id: number;
  title: string;
  posts: any[];
}

@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [
    RouterModule,
    MeniuComponent,
    PostareComponent,
    CadranComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    PostManagerComponent,
    PostEditorComponent
  ],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent implements OnInit {
  // Definim secțiunile statice
  sections: Section[] = [
    { id: 0, title: 'Noutăți și Articole', posts: [] },
    { id: 1, title: 'Peisaje din curtea muzeului', posts: [] },
    { id: 2, title: 'Expoziții permanente', posts: [] },
    { id: 3, title: 'Prietenii muzeului', posts: [] }
  ];
  
  posts: any[] = [];
  isAdmin: boolean = false;
  editingPostId: number | null = null;
  selectedSectionId: number = 0;
  newPostDescription: string = '';
  newPostImages: any[] = [];

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verifică starea autentificării
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isAdmin = isAuthenticated;
      }
    );
    
    // Încarcă postările
    this.loadPosts();
  }

  // Obține postările pentru o secțiune specifică
  getPostsForSection(sectionId: number): any[] {
    // În această versiune simplă, toate postările sunt în prima secțiune
    // Restul secțiunilor sunt goale
    if (sectionId === 0) {
      return this.posts;
    }
    return [];
  }
  
  // Verifică dacă o secțiune are postări
  hasPosts(sectionId: number): boolean {
    return this.getPostsForSection(sectionId).length > 0;
  }

  // Încarcă toate postările din backend
  loadPosts() {
    this.postService.getPosts().subscribe({
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

  // Șterge o postare
  deletePost(id: number) {
    if (!this.isAdmin) {
      alert('Trebuie să fiți autentificat ca administrator pentru a șterge o postare!');
      return;
    }

    if (confirm('Sigur doriți să ștergeți această postare?')) {
      this.postService.deletePost(id).subscribe({
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

  // Începe editarea unei postări
  editPost(post: any) {
    if (!this.isAdmin) {
      alert('Trebuie să fiți autentificat ca administrator pentru a edita o postare!');
      return;
    }
    
    this.editingPostId = post.id;
  }

  // Anulează editarea
  cancelEdit() {
    this.editingPostId = null;
  }

  // Actualizează postarea după modificare
  onPostUpdated() {
    this.editingPostId = null;
    this.loadPosts();
  }

  // Gestionează evenimentul de creare a postării din componenta PostManager
  onPostCreated() {
    this.loadPosts();
  }
  
  // Funcție pentru deconectare
  logout() {
    this.authService.logout();
    alert('V-ați deconectat cu succes!');
    // Reîncărcăm pagina pentru a actualiza interfața
    window.location.reload();
  }
  
  // Adăugăm un link pentru pagina de login pentru administratori
  goToLogin() {
    this.router.navigate(['/administrator-login']);
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
        if (this.newPostImages.length >= 5) {
          alert('Poți adăuga maxim 5 imagini la o postare.');
          break;
        }
        
        // Citește fișierul și adaugă-l la lista de imagini
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.newPostImages.push({
            url: reader.result as string,
            file: file
          });
        };
      }
    }
    
    // Resetează input-ul pentru a permite reîncărcarea aceluiași fișier
    event.target.value = '';
  }

  // Elimină o imagine din lista de imagini selectate
  removeImage(index: number) {
    this.newPostImages.splice(index, 1);
  }

  // Adaugă postare în secțiunea selectată
  addPostToSelectedSection() {
    if (!this.newPostDescription.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }
    
    const sectionId = this.selectedSectionId;
    
    const newPost = { 
      description: this.newPostDescription, 
      images: this.newPostImages,
      sectionId: sectionId
    };

    // Afișăm un indicator de încărcare sau un mesaj
    console.log('Adaugă postare în secțiunea:', sectionId);
    
    this.postService.addPost(newPost).subscribe({
      next: () => {
        alert('Postare adăugată cu succes în secțiunea: ' + this.sections[sectionId].title);
        this.newPostDescription = '';
        this.newPostImages = [];
        this.loadPosts();
      },
      error: (err) => {
        console.error('Eroare la crearea postării:', err);
        alert('A apărut o eroare la crearea postării. Vă rugăm să încercați din nou.');
      }
    });
  }
}
