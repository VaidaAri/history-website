import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { NotificationService } from '../services/notification.service';
import { Subscription, interval } from 'rxjs';
import { NotificationContainerComponent } from '../components/notification-container/notification-container.component';
import { TranslatePipe } from '../services/i18n/translate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NotificationContainerComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'History-website-frontend';
  isAdmin = false;
  adminName = '';
  showAdminModal = false;
  admins: any[] = [];
  private refreshSubscription: Subscription | null = null;
  
  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    private reservationService: ReservationService,
    private notificationService: NotificationService
  ) {}
  
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
  }
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
      
    });
    
    this.authService.adminName$.subscribe(name => {
      this.adminName = name;
    });
  }
  
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    
  }
  
  
  showAdminList() {
    this.loadAdmins();
    this.showAdminModal = true;
  }
  
  closeAdminList() {
    this.showAdminModal = false;
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
  
  logout() {
    this.authService.logout();
  }
}
