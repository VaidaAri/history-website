import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'History-website-frontend';
  isAdmin = false;
  adminName = '';
  showAdminModal = false;
  admins: any[] = [];
  pendingReservationsCount = 0;
  private refreshSubscription: Subscription | null = null;
  
  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    private reservationService: ReservationService
  ) {}
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
      
      if (isAuthenticated) {
        // Inițializăm contorizarea rezervărilor în așteptare
        this.loadPendingReservationsCount();
        
        // Actualizăm numărul la fiecare 30 de secunde
        this.refreshSubscription = interval(30000).subscribe(() => {
          this.loadPendingReservationsCount();
        });
      } else {
        // Dacă nu mai suntem autentificați, oprim actualizarea automată
        if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
          this.refreshSubscription = null;
        }
      }
    });
    
    this.authService.adminName$.subscribe(name => {
      this.adminName = name;
    });
  }
  
  ngOnDestroy() {
    // Ne asigurăm că dezabonăm pentru a evita memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  // Încarcă numărul de rezervări în așteptare
  loadPendingReservationsCount() {
    if (this.isAdmin) {
      this.reservationService.getPendingReservationsCount().subscribe({
        next: (data) => {
          this.pendingReservationsCount = data.count;
        },
        error: (err) => {
          console.error('Eroare la obținerea numărului de rezervări în așteptare:', err);
        }
      });
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
  
  logout() {
    this.authService.logout();
  }
}
