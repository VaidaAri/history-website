import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { PostareComponent } from '../postare/postare.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

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

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadPosts();
    this.loadAdmins();
    this.loadEvents();
  }

  checkAuthentication() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/administrator-login']);
    }
  }

  loadPosts() {
    this.http.get<any[]>('http://localhost:8080/api/posts').subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Eroare la încărcarea postărilor.';
        this.notificationService.showError('Eroare încărcare', errorMessage);
      }
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
      this.notificationService.showWarning('Câmp obligatoriu', 'Descrierea nu poate fi goală!');
      return;
    }

    const newPost = { description: this.description, images: this.images };

    this.http.post('http://localhost:8080/api/posts', newPost).subscribe({
      next: (response: any) => {
        const successMessage = response?.message || 'Postare adăugată cu succes!';
        this.notificationService.showSuccess('Postare adăugată', successMessage);
        this.description = '';
        this.images = [];
        this.loadPosts();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Eroare la adăugarea postării.';
        this.notificationService.showError('Eroare postare', errorMessage);
      }
    });
  }

  async deletePost(id: number) {
    const confirmed = await this.notificationService.showConfirm(
      'Confirmare ștergere',
      'Sigur vrei să ștergi această postare? Această acțiune nu poate fi anulată.',
      'Șterge',
      'Anulează'
    );
    
    if (confirmed) {
      this.http.delete(`http://localhost:8080/api/posts/${id}`).subscribe({
        next: () => {
          this.notificationService.showSuccess('Postare ștearsă', 'Postarea a fost ștearsă cu succes!');
          this.loadPosts();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Eroare la ștergerea postării.';
          this.notificationService.showError('Eroare ștergere', errorMessage);
        }
      });
    }
  }

  loadAdmins() {
    this.http.get<any[]>('http://localhost:8080/api/administrators').subscribe({
      next: (data) => {
        this.admins = data;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Eroare la încărcarea administratorilor.';
        this.notificationService.showError('Eroare încărcare', errorMessage);
      }
    });
  }

  async deleteAdmin(adminId: number) {
    const confirmed = await this.notificationService.showConfirm(
      'Confirmare ștergere',
      'Sigur vrei să ștergi acest administrator? Această acțiune nu poate fi anulată.',
      'Șterge',
      'Anulează'
    );
    
    if (confirmed) {
      this.http.delete(`http://localhost:8080/api/administrators/${adminId}`).subscribe({
        next: () => {
          this.notificationService.showSuccess('Administrator șters', 'Administrator șters cu succes!');
          this.loadAdmins();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Eroare la ștergere. Încearcă din nou.';
          this.notificationService.showError('Eroare ștergere', errorMessage);
        }
      });
    }
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Eroare la încărcarea evenimentelor.';
        this.notificationService.showError('Eroare încărcare', errorMessage);
      }
    });
  }
  
  editEvent(event: any) {
    this.notificationService.showInfo('Funcționalitate în dezvoltare', 'Funcționalitatea de editare a evenimentelor va fi disponibilă în curând!');
  }
  
  async deleteEvent(id: number) {
    const confirmed = await this.notificationService.showConfirm(
      'Confirmare ștergere',
      'Sigur vrei să ștergi acest eveniment? Această acțiune nu poate fi anulată.',
      'Șterge',
      'Anulează'
    );
    
    if (confirmed) {
      this.http.delete(`http://localhost:8080/api/events/${id}`).subscribe({
        next: () => {
          this.notificationService.showSuccess('Eveniment șters', 'Eveniment șters cu succes!');
          this.loadEvents();
          
          const eventDeletedEvent = new CustomEvent('eventDeleted', { 
            detail: { eventId: id }
          });
          window.dispatchEvent(eventDeletedEvent);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Eroare la ștergerea evenimentului!';
          this.notificationService.showError('Eroare ștergere', errorMessage);
        }
      });
    }
  }

  changeSection(section: string) {
    this.currentSection = section;
  }

  logout() {
    this.authService.logout();
  }
}
