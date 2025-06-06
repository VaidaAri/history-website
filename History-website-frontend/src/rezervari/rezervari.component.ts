import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from '../cadran/cadran.component';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { NotificationService } from '../services/notification.service';
import { MuseumScheduleService, MuseumSchedule } from '../services/museum-schedule.service';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';
import { SmartCalendarComponent } from '../smart-calendar/smart-calendar.component';

@Component({
  selector: 'app-rezervari',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CommonModule, FormsModule, CadranComponent, TranslatePipe, SmartCalendarComponent],
  templateUrl: './rezervari.component.html',
  styleUrls: ['./rezervari.component.css'],
  providers: [TranslationService]
})
export class RezervariComponent implements OnInit {
  isAdmin: boolean = false;
  bookings: any = [];

  // Formularul pentru rezervare
  reservationForm: any;
  
  // Datele formularului
  selectedDate: string = '';
  selectedTime: string = '';
  availableHours: string[] = [];
  
  // Datele rezervării
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
  
  // Limite pentru datepicker
  minDate: string = '';
  maxDate: string = '';
  
  // Restricții și mesaje de eroare
  minDateTime: string = ''; // pentru compatibilitate
  maxDateTime: string = ''; // pentru compatibilitate
  dateTimeError: string = '';
  
  // Validare email
  emailValidationError: string = '';
  emailValidationSuccess: boolean = false;

  // Smart calendar
  showSmartCalendar: boolean = false;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private museumScheduleService: MuseumScheduleService
  ) {
    // Inițializăm limitele datei
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    // Setăm data maximă la 3 luni în viitor
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

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
    this.minDateTime = today.toISOString().slice(0, 16); // pentru compatibilitate
    this.minDate = today.toISOString().split('T')[0];    // pentru noul input de dată
    
    // Data maximă = 3 luni în viitor
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDateTime = maxDate.toISOString().slice(0, 16); // pentru compatibilitate
    this.maxDate = maxDate.toISOString().split('T')[0];    // pentru noul input de dată
  }
  
  // Generează intervalele orare disponibile în funcție de ziua selectată
  generateAvailableHours(date: Date): string[] {
    if (!this.currentSchedule || !date) return [];
    
    const dayOfWeek = date.getDay(); // 0 = duminică, 1 = luni, ...
    
    // Nu permitem rezervări lunea (ziua 1)
    if (dayOfWeek === 1) {
      this.dateTimeError = "Muzeul este închis lunea. Vă rugăm să selectați o altă zi.";
      return [];
    }
    
    // Transformă orele din string în minute de la miezul nopții
    const parseTimeToMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    // Transformă minutele în string-uri de forma "HH:MM"
    const minutesToTimeString = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
    
    // Funcție pentru generarea intervalelor de 2 ore
    const createTimeInterval = (startMinutes: number): string => {
      const endMinutes = startMinutes + 120; // 2 ore
      const startTime = minutesToTimeString(startMinutes);
      const endTime = minutesToTimeString(endMinutes);
      return `${startTime}-${endTime}`;
    };
    
    // Obținem ora de deschidere și închidere în funcție de zi
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
    
    // Generăm slot-uri orare la fiecare 2 ore, lăsând cel puțin o oră la final pentru vizită
    const hours: string[] = [];
    
    // Verificăm dacă data selectată este astăzi
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
    
    // Dacă este astăzi, ajustăm ora de start de la ora curentă + 1 oră
    let startMinutes = openTime;
    if (isToday) {
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      // Rotunjim la următoarea oră completă
      const nextHourMinutes = Math.ceil(currentMinutes / 60) * 60;
      startMinutes = Math.max(openTime, nextHourMinutes);
    }
    
    // Generăm intervalele de 2 ore disponibile, asigurând că fiecare interval se încadrează în programul muzeului
    for (let timeMinutes = startMinutes; timeMinutes <= closeTime - 120; timeMinutes += 120) {
      hours.push(createTimeInterval(timeMinutes));
    }
    
    return hours;
  }
  
  // Când se schimbă data selectată
  onDateSelected() {
    if (!this.selectedDate) {
      this.availableHours = [];
      this.selectedTime = '';
      this.dateTimeError = '';
      this.newBooking.datetime = '';
      return;
    }
    
    // Convertim string-ul de dată într-un obiect Date
    const selectedDate = new Date(this.selectedDate);
    
    // Generăm orele disponibile pentru data selectată
    this.availableHours = this.generateAvailableHours(selectedDate);
    
    // Resetăm ora selectată
    this.selectedTime = '';
    this.dateTimeError = '';
    
    // Dacă nu avem ore disponibile pentru ziua selectată
    if (this.availableHours.length === 0 && this.selectedDate) {
      if (selectedDate.getDay() === 1) {
        this.dateTimeError = "Muzeul este închis lunea. Vă rugăm să selectați o altă zi.";
      } else {
        this.dateTimeError = "Nu există ore disponibile pentru rezervare în această zi.";
      }
    }
    
    // Actualizăm datetime pentru transmitere la backend
    this.updateDateTime();
  }
  
  // Când se schimbă ora selectată
  onTimeSelected() {
    this.dateTimeError = '';
    this.updateDateTime();
  }
  
  // Actualizează valoarea combinată a datei și orei
  updateDateTime() {
    if (!this.selectedDate || !this.selectedTime) {
      // Dacă nu avem ambele valori, resetăm datetime
      this.newBooking.datetime = '';
      return;
    }
    
    // Extragem ora de început din intervalul selectat (format: "09:00-11:00")
    const startTime = this.selectedTime.split('-')[0];
    
    // Combinăm data și ora de început în formatul exact așteptat de backend: yyyy-MM-dd'T'HH:mm
    // Backend utilizează @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") pentru LocalDateTime
    this.newBooking.datetime = `${this.selectedDate}T${startTime}`;
    
    // Log pentru debugging
    console.log('Formatted datetime for backend:', this.newBooking.datetime);
  }

  // Validează data și ora selectată
  validateDateTime() {
    // Noua implementare a validării se face la selecția datei și orei
    // Această metodă este păstrată pentru compatibilitate și cazul folosirii vechiului control datetime-local
    if (!this.selectedDate || !this.selectedTime) {
      this.dateTimeError = "Vă rugăm să selectați atât data cât și ora.";
      return false;
    }
    
    // Dacă am ajuns aici, înseamnă că validările au trecut în onDateSelected și onTimeSelected
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

    console.log("Sending booking with datetime:", this.newBooking.datetime);
    
    this.reservationService.createReservation(this.newBooking).subscribe({
      next: (response) => {
        // Verificăm dacă răspunsul are proprietatea message înainte de a o folosi
        const successMessage = response && response.message
          ? `Rezervare adăugată cu succes! ${response.message}`
          : "Rezervare adăugată cu succes!";

        this.notificationService.showSuccess('Rezervare confirmată', successMessage);

        this.resetBookingForm();

        if (this.isAdmin) {
          this.fetchBookings();
        }
        
        // Auto-refresh pentru actualizarea calendarului
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error("Error adding booking:", err);
        const errorMessage = err.error?.message || "Eroare la adăugarea rezervării. Vă rugăm să încercați din nou.";
        this.notificationService.showError('Eroare rezervare', errorMessage);
      }
    });
  }
  
  // Validare email în timp real
  validateEmail() {
    const email = this.newBooking.email;
    
    // Resetăm mesajele
    this.emailValidationError = '';
    this.emailValidationSuccess = false;
    
    if (!email || email.trim() === '') {
      return;
    }
    
    // Regex pentru validare email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      this.emailValidationError = 'Formatul email-ului nu este valid';
      return;
    }
    
    // Verificări suplimentare
    if (email.length > 254) {
      this.emailValidationError = 'Email-ul este prea lung';
      return;
    }
    
    // Verificăm domeniul
    const domain = email.split('@')[1];
    if (domain && domain.includes('..')) {
      this.emailValidationError = 'Domeniul email-ului nu este valid';
      return;
    }
    
    // Email valid
    this.emailValidationSuccess = true;
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
    this.selectedDate = '';
    this.selectedTime = '';
    this.availableHours = [];
    this.dateTimeError = '';
    this.emailValidationError = '';
    this.emailValidationSuccess = false;
  }

  async deleteBooking(bookingId: number) {
    const confirmed = await this.notificationService.showConfirm(
      'Confirmare ștergere',
      'Sigur doriți să ștergeți această rezervare? Această acțiune nu poate fi anulată.',
      'Șterge',
      'Anulează'
    );
    
    if (confirmed) {
      this.reservationService.deleteReservation(bookingId).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Rezervare ștearsă', 'Rezervarea a fost ștearsă cu succes!');
          this.fetchBookings();
          
          // Auto-refresh pentru actualizarea calendarului
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        error: (err) => {
          console.error("Error deleting booking:", err);
          const errorMessage = err.error?.message || "Eroare la ștergerea rezervării. Vă rugăm să încercați din nou.";
          this.notificationService.showError('Eroare ștergere', errorMessage);
        }
      });
    }
  }
  
  
  getStatusDisplayName(status: string): string {
    switch(status) {
      case 'NECONFIRMATA': return 'Neconfirmată';
      case 'CONFIRMATA': return 'Confirmată';
      case 'IN_ASTEPTARE': return 'În așteptare';
      case 'APROBATA': return 'Aprobată';
      case 'RESPINSA': return 'Respinsă';
      default: return 'În așteptare';
    }
  }

  // Smart calendar functions
  openSmartCalendar() {
    this.showSmartCalendar = true;
  }

  closeSmartCalendar() {
    this.showSmartCalendar = false;
  }

  onDateSelectedFromCalendar(dateStr: string) {
    this.selectedDate = dateStr;
    this.onDateSelected(); // Apelăm logica existentă
    this.showSmartCalendar = false;
  }

  onDateTimeSelectedFromCalendar(selection: {date: string, time: string}) {
    this.selectedDate = selection.date;
    
    // Generăm lista de ore disponibile ÎNAINTE de a seta ora
    this.onDateSelected();
    
    // Acum setăm ora selectată DUPĂ ce lista este generată
    this.selectedTime = selection.time;
    
    this.onTimeSelected(); // Pentru a actualiza datetime
    this.showSmartCalendar = false;
  }
  
}