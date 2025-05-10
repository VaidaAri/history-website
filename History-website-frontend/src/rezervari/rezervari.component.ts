import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { MuseumScheduleService, MuseumSchedule } from '../services/museum-schedule.service';

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
    numberOfPersons: 1,
    guideRequired: false,
    status: 'IN_ASTEPTARE'
  };

  // Programul muzeului
  currentSchedule: MuseumSchedule | null = null;
  isLoading = true;

  // Date & time restrictions
  minDateTime: string = '';
  maxDateTime: string = '';
  dateTimeError: string = '';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router,
    private reservationService: ReservationService,
    private museumScheduleService: MuseumScheduleService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAuthenticated();
    
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
    
    if (this.isAdmin) {
      this.fetchBookings();
    }
    
    // Încărcăm programul muzeului
    this.loadMuseumSchedule();
  }
  
  // Încărcăm programul curent al muzeului
  loadMuseumSchedule() {
    this.isLoading = true;
    this.museumScheduleService.getCurrentSchedule().subscribe({
      next: (schedule) => {
        this.currentSchedule = schedule;
        this.isLoading = false;

        // Setăm restricțiile de dată și oră
        this.setDateTimeRestrictions();
      },
      error: (err) => {
        console.error('Eroare la încărcarea programului muzeului:', err);
        this.isLoading = false;
      }
    });
  }

  // Setează restricțiile pentru data și ora rezervării
  setDateTimeRestrictions() {
    if (!this.currentSchedule) return;

    // Data minimă = ziua curentă
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDateTime = today.toISOString().slice(0, 16);

    // Data maximă = 3 luni în viitor
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDateTime = maxDate.toISOString().slice(0, 16);
  }

  // Validează data și ora selectată
  validateDateTime() {
    if (!this.newBooking.datetime || !this.currentSchedule) return;

    const selectedDate = new Date(this.newBooking.datetime);
    const dayOfWeek = selectedDate.getDay(); // 0 = duminică, 1 = luni, ...
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    // Nu permitem rezervări lunea (ziua 1)
    if (dayOfWeek === 1) {
      this.dateTimeError = "Muzeul este închis lunea. Vă rugăm să selectați o altă zi.";
      return false;
    }

    // Convertim orele din string în minute pentru comparație
    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Orele de deschidere și închidere în funcție de zi
    let openTime, closeTime;

    if (dayOfWeek >= 2 && dayOfWeek <= 5) {
      // Marți - Vineri
      openTime = parseTimeToMinutes(this.currentSchedule.weekdaysOpen);
      closeTime = parseTimeToMinutes(this.currentSchedule.weekdaysClose);
    } else {
      // Sâmbătă - Duminică
      openTime = parseTimeToMinutes(this.currentSchedule.weekendOpen);
      closeTime = parseTimeToMinutes(this.currentSchedule.weekendClose);
    }

    // Timpul selectat în minute
    const selectedTime = hours * 60 + minutes;

    // Verificăm dacă timpul selectat este în intervalul de program
    if (selectedTime < openTime) {
      this.dateTimeError = "Ora selectată este înainte de deschiderea muzeului.";
      return false;
    }

    // Ora ultimei rezervări este cu 1 oră înainte de închidere
    if (selectedTime > closeTime - 60) {
      this.dateTimeError = "Ora selectată este prea aproape de închidere. Ultima rezervare se poate face cu cel puțin o oră înainte de închidere.";
      return false;
    }

    // Totul este în regulă
    this.dateTimeError = '';
    return true;
  }
  
  logout() {
    this.authService.logout();
  }

  fetchBookings() {
    this.http.get("http://localhost:8080/api/bookings").subscribe((data: any) => {
      this.bookings = data;
      
      // Afișăm datele primite în consolă pentru a verifica statusul
      console.log('Bookings data received:', this.bookings);
    });
  }

  addBooking() {
    // Validăm data și ora înainte de a trimite rezervarea
    if (!this.validateDateTime()) {
      return;
    }

    this.reservationService.createReservation(this.newBooking).subscribe({
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
      numberOfPersons: 1,
      guideRequired: false,
      status: 'IN_ASTEPTARE'
    };
  }

  deleteBooking(bookingId: number) {
    if (confirm("Sigur doriți să ștergeți această rezervare?")) {
      this.reservationService.deleteReservation(bookingId).subscribe({
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
      this.reservationService.approveReservation(bookingId).subscribe({
        next: (response) => {
          // Actualizăm și starea în UI imediat, fără a aștepta reîncărcarea
          const bookingIndex = this.bookings.findIndex((booking: any) => booking.id === bookingId);
          if (bookingIndex !== -1) {
            this.bookings[bookingIndex].status = 'APROBATA';
            console.log(`Rezervare cu ID ${bookingId} actualizată la status APROBATA`);
          }
          
          alert(response.message || "Rezervare aprobată cu succes!");
          
          // Reîncărcăm lista pentru a fi siguri că avem cele mai recente date
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
