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
    datetime: '',
    numberOfPersons: 0,
    guideRequired: false
  };

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificăm dacă utilizatorul este administrator
    this.isAdmin = this.authService.isAuthenticated();
    
    // Abonăm pentru a detecta schimbări în starea de autentificare
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
    
    // Încărcăm lista rezervărilor doar dacă utilizatorul este admin
    if (this.isAdmin) {
      this.fetchBookings();
    }
  }
  
  // Metoda pentru deconectare
  logout() {
    this.authService.logout();
  }

  fetchBookings() {
    this.http.get("http://localhost:8080/api/bookings").subscribe((data) => {
      this.bookings = data;
    });
  }

  addBooking() { 
    this.http.post("http://localhost:8080/api/bookings", this.newBooking).subscribe({
      next: (response) => {
        alert("Booking added successfully!");
     console.log("New booking data: ", this.newBooking);
        this.fetchBookings(); 
      },
      error: (err) => {
        console.error("Error adding booking:", err);
        alert("Failed to add booking. Please try again.");
      }
    });
  }

  deleteBooking(bookingId: number) {
    if (confirm("Are you sure you want to delete this booking?")) {
      this.http.delete(`http://localhost:8080/api/bookings/${bookingId}`).subscribe({
        next: (response) => {
          alert("Booking deleted successfully!");
          this.fetchBookings();
        },
        error: (err) => {
          console.error("Error deleting booking:", err);
          alert("Failed to delete booking. Please try again.");
        }
      });
    }
  }
}
