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
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

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
    PostEditorComponent,
    TranslatePipe
  ],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css',
  providers: [TranslationService]
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
    private router: Router,
    private translationService: TranslationService
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

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        // Filtrăm postările goale (cele fără descriere sau cu descriere goală)
        this.posts = data.filter(post => 
          post.description && 
          post.description.trim().length > 0
        );
        
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

 
  editPost(post: any) {
    if (!this.isAdmin) {
      alert('Trebuie să fiți autentificat ca administrator pentru a edita o postare!');
      return;
    }
    
    this.editingPostId = post.id;
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  onPostUpdated() {
    this.editingPostId = null;
    this.loadPosts();
  }

  onPostCreated() {
    this.loadPosts();
  }
  
  logout() {
    this.authService.logout();
    alert('V-ați deconectat cu succes!');
  }
  

  goToLogin() {
    this.router.navigate(['/administrator-login']);
  }
  
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.type.match(/image\/*/) == null) {
          alert('Doar fișierele de tip imagine sunt permise!');
          continue;
        }
        
        if (this.newPostImages.length >= 5) {
          alert('Poți adăuga maxim 5 imagini la o postare.');
          break;
        }

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
    
    event.target.value = '';
  }

  removeImage(index: number) {
    this.newPostImages.splice(index, 1);
  }

  addPostToSelectedSection() {
    if (!this.newPostDescription.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }
    
    const newPost = { 
      description: this.newPostDescription, 
      images: this.newPostImages

    };

    this.postService.addPost(newPost).subscribe({
      next: () => {
        alert('Postare adăugată cu succes!');
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
