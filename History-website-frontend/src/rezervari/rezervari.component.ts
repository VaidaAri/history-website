import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rezervari',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CommonModule, FormsModule, CadranComponent],
  templateUrl: './rezervari.component.html',
  styleUrls: ['./rezervari.component.css']
})
export class RezervariComponent implements OnInit {
  isAdmin: boolean = false;
  bookings: any = [];

  newBooking = {
    nume: '',
    prenume: '',
    email: '',
    datetime: '',
    numberOfPersons: 0,
    guideRequired: false,
    status: 'IN_ASTEPTARE'
  };

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAuthenticated();
    
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
    
    if (this.isAdmin) {
      this.fetchBookings();
    }
  }
  
  logout() {
    this.authService.logout();
  }

  fetchBookings() {
    this.http.get("http://localhost:8080/api/bookings").subscribe((data) => {
      this.bookings = data;
    });
  }

  addBooking() { 
    this.http.post<any>("http://localhost:8080/api/bookings", this.newBooking).subscribe({
      next: (response) => {
        // Verificăm dacă răspunsul are proprietatea message înainte de a o folosi
        const successMessage = response && response.message 
          ? `Rezervare adăugată cu succes! ${response.message}` 
          : "Rezervare adăugată cu succes!";
        
        alert(successMessage);
        
        this.resetBookingForm();
        
        if (this.isAdmin) {
          this.fetchBookings();
        }
      },
      error: (err) => {
        console.error("Error adding booking:", err);
        alert("Eroare la adăugarea rezervării. Vă rugăm să încercați din nou.");
      }
    });
  }
  
  resetBookingForm() {
    this.newBooking = {
      nume: '',
      prenume: '',
      email: '',
      datetime: '',
      numberOfPersons: 0,
      guideRequired: false,
      status: 'IN_ASTEPTARE'
    };
  }

  deleteBooking(bookingId: number) {
    if (confirm("Sigur doriți să ștergeți această rezervare?")) {
      this.http.delete(`http://localhost:8080/api/bookings/${bookingId}`).subscribe({
        next: (response) => {
          alert("Rezervare ștearsă cu succes!");
          this.fetchBookings();
        },
        error: (err) => {
          console.error("Error deleting booking:", err);
          alert("Eroare la ștergerea rezervării. Vă rugăm să încercați din nou.");
        }
      });
    }
  }
  
  approveBooking(bookingId: number) {
    if (confirm("Sigur doriți să aprobați această rezervare?")) {
      this.http.put<any>(`http://localhost:8080/api/bookings/${bookingId}/approve`, {}).subscribe({
        next: (response) => {
          alert(response.message || "Rezervare aprobată cu succes!");
          this.fetchBookings();
        },
        error: (err) => {
          console.error("Error approving booking:", err);
          alert("Eroare la aprobarea rezervării. Vă rugăm să încercați din nou.");
        }
      });
    }
  }
}
