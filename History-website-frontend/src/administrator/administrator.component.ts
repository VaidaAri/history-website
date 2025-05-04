import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { PostareComponent } from '../postare/postare.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [CommonModule, FormsModule, PostareComponent, RouterModule],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.css'
})
export class AdministratorComponent implements OnInit {
  posts: any[] = [];
  admins: any[] = [];
  events: any[] = [];
  description: string = '';
  imageUrl: string = '';
  images: any[] = [];
  currentSection: string = 'posts';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadPosts();
    this.loadAdmins();
    this.loadEvents();
  }

  checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminToken'); 
    if (!isLoggedIn) {
      this.router.navigate(['/administrator-login']);
    }
  }

  loadPosts() {
    this.http.get<any[]>('http://localhost:8080/api/posts').subscribe(data => {
      this.posts = data;
    });
  }

  addImage() {
    if (this.imageUrl.trim()) {
      this.images.push({ url: this.imageUrl });
      this.imageUrl = ''; 
    }
  }

  createPost() {
    if (!this.description.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }

    const newPost = { description: this.description, images: this.images };

    this.http.post('http://localhost:8080/api/posts', newPost).subscribe(() => {
      alert('Postare adăugată cu succes!');
      this.description = '';
      this.images = [];
      this.loadPosts();
    });
  }

  deletePost(id: number) {
    if (confirm('Sigur vrei să ștergi această postare?')) {
      this.http.delete(`http://localhost:8080/api/posts/${id}`).subscribe(() => {
        alert('Postare ștearsă!');
        this.loadPosts();
      });
    }
  }

  loadAdmins() {
    this.http.get<any[]>('http://localhost:8080/api/administrators').subscribe(data => {
      this.admins = data;
    });
  }

  deleteAdmin(adminId: number) {
    if (confirm("Sigur vrei să ștergi acest administrator?")) {
      this.http.delete(`http://localhost:8080/api/administrators/${adminId}`).subscribe({
        next: () => {
          alert("Administrator șters cu succes!");
          this.loadAdmins();
        },
        error: (err) => {
          console.error("Eroare la ștergere:", err);
          alert("Eroare la ștergere. Încearcă din nou.");
        }
      });
    }
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe(data => {
      this.events = data;
    });
  }
  
  editEvent(event: any) {
    // Implementarea editării va necesita o funcționalitate mai complexă
    // care va fi adăugată într-o fază ulterioară
    alert('Funcționalitatea de editare a evenimentelor va fi disponibilă în curând!');
  }
  
  deleteEvent(id: number) {
    if (confirm('Sigur vrei să ștergi acest eveniment?')) {
      this.http.delete(`http://localhost:8080/api/events/${id}`).subscribe(() => {
        alert('Eveniment șters cu succes!');
        this.loadEvents();
      }, error => {
        console.error('Eroare la ștergerea evenimentului:', error);
        alert('Eroare la ștergerea evenimentului!');
      });
    }
  }

  changeSection(section: string) {
    this.currentSection = section;
  }

  logout() {
    localStorage.removeItem('adminToken'); 
    this.router.navigate(['/administrator-login']);
  }
}
