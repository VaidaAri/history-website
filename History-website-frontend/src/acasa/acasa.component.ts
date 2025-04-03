import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { PostareComponent } from '../postare/postare.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from "../cadran/cadran.component";
import { PostManagerComponent } from '../components/post-manager/post-manager.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

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
    PostManagerComponent
  ],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent implements OnInit {
  posts: any[] = [];
  isAdmin: boolean = false;

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
}
