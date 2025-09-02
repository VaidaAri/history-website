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

  reservationForm: any;
  
  selectedDate: string = '';
  selectedTime: string = '';
  
  newBooking = {
    nume: '',
    prenume: '',
    email: '',
    datetime: '',
    numberOfPersons: 1,
    guideRequired: false,
    status: 'NECONFIRMATA',
    ageGroup: ''
  };
  
  ageGroupOptions = [
    { value: 'COPII', label: 'Copii (sub 18 ani)', icon: '👶' },
    { value: 'STUDENTI', label: 'Studenți', icon: '👨‍🎓' },
    { value: 'ADULTI', label: 'Adulți', icon: '👨‍💼' },
    { value: 'PENSIONARI', label: 'Pensionari', icon: '👵' }
  ];
  
  currentSchedule: MuseumSchedule | null = null;
  isLoading = true;
  
  minDate: string = '';
  maxDate: string = '';
  
  minDateTime: string = ''; 
  maxDateTime: string = ''; 
  dateTimeError: string = '';
  
  emailValidationError: string = '';
  emailValidationSuccess: boolean = false;

  showSmartCalendar: boolean = false;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private museumScheduleService: MuseumScheduleService
  ) {

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
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
    
    this.loadMuseumSchedule();
  }
  
  loadMuseumSchedule() {
    this.isLoading = true;
    this.museumScheduleService.getCurrentSchedule().subscribe({
      next: (schedule) => {
        this.currentSchedule = schedule;
        this.isLoading = false;

        this.setDateTimeRestrictions();
      },
      error: (err) => {
        this.notificationService.showError('Eroare', 'Nu s-a putut încărca programul muzeului. Vă rugăm reîncărcați pagina.');
        this.isLoading = false;
      }
    });
  }

  setDateTimeRestrictions() {
    if (!this.currentSchedule) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDateTime = today.toISOString().slice(0, 16); 
    this.minDate = today.toISOString().split('T')[0];    
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDateTime = maxDate.toISOString().slice(0, 16); 
    this.maxDate = maxDate.toISOString().split('T')[0];   
  }
  
  
  updateDateTime() {
    if (!this.selectedDate || !this.selectedTime) {
      this.newBooking.datetime = '';
      return;
    }
    
    const startTime = this.selectedTime.split('-')[0];
    
    this.newBooking.datetime = `${this.selectedDate}T${startTime}`;
    
  }

  validateDateTime() {
    if (!this.selectedDate || !this.selectedTime) {
      this.dateTimeError = "Vă rugăm să selectați atât data cât și ora.";
      return false;
    }
    
    return true;
  }
  
  logout() {
    this.authService.logout();
  }

  fetchBookings() {
    if (!this.isAdmin) {
      return;
    }
    
    this.http.get("http://localhost:8080/api/bookings").subscribe({
      next: (data: any) => {
        this.bookings = data;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        // Silent error for better user experience
      }
    });
  }

  addBooking() {
    if (!this.validateDateTime()) {
      return;
    }

    
    this.reservationService.createReservation(this.newBooking).subscribe({
      next: (response) => {
        const successMessage = response && response.message
          ? response.message
          : "Rezervarea a fost înregistrată cu succes! Vă rugăm să verificați email-ul pentru confirmare.";

        this.notificationService.showSuccess('Rezervare înregistrată', successMessage, 7000);

        this.resetBookingForm();

        if (this.isAdmin) {
          this.fetchBookings();
        }
        
      },
      error: (err) => {
        const errorMessage = err.error?.message || "Eroare la adăugarea rezervării. Vă rugăm să încercați din nou.";
        this.notificationService.showError('Eroare rezervare', errorMessage);
      }
    });
  }
  
  validateEmail() {
    const email = this.newBooking.email;
    
    this.emailValidationError = '';
    this.emailValidationSuccess = false;
    
    if (!email || email.trim() === '') {
      return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      this.emailValidationError = 'Formatul email-ului nu este valid';
      return;
    }
    
    if (email.length > 254) {
      this.emailValidationError = 'Email-ul este prea lung';
      return;
    }
    
    const domain = email.split('@')[1];
    if (domain && domain.includes('..')) {
      this.emailValidationError = 'Domeniul email-ului nu este valid';
      return;
    }
    
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
      status: 'NECONFIRMATA',
      ageGroup: ''
    };
    this.selectedDate = '';
    this.selectedTime = '';
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
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        error: (err) => {
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
      case 'RESPINSA': return 'Respinsă';
      default: return 'Neconfirmată';
    }
  }

  getAgeGroupDisplayName(ageGroup: string): string {
    const option = this.ageGroupOptions.find(opt => opt.value === ageGroup);
    return option ? `${option.icon} ${option.label}` : 'Nespecificat';
  }

  openSmartCalendar() {
    this.showSmartCalendar = true;
  }

  closeSmartCalendar() {
    this.showSmartCalendar = false;
  }

  onDateSelectedFromCalendar(dateStr: string) {
    this.selectedDate = dateStr;
    this.updateDateTime(); 
    this.showSmartCalendar = false;
  }

  onDateTimeSelectedFromCalendar(selection: {date: string, time: string}) {
    this.selectedDate = selection.date;
    this.selectedTime = selection.time;
    
    this.updateDateTime(); 
    this.showSmartCalendar = false;
  }
  
}