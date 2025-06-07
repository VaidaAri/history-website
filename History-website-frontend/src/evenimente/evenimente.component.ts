import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { SmartEventCalendarComponent } from '../components/smart-event-calendar/smart-event-calendar.component';
import { CadranComponent } from "../cadran/cadran.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, MeniuComponent, CalendarComponent, SmartEventCalendarComponent, CadranComponent, TranslatePipe],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css',
  providers: [TranslationService]
})
export class EvenimenteComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  events: any[] = [];
  showEventsList: boolean = false;
  
  
  selectedEvent: any = null;
  showRegistrationModal: boolean = false;
  showEventDetailsModal: boolean = false;
  showImageModal: boolean = false;
  selectedImage: any = null;
  
  registrationForm = {
    nume: '',
    prenume: '',
    email: ''
  };
  
  // Sistem de notificări
  notification = {
    show: false,
    type: 'success', // 'success', 'error', 'warning'
    title: '',
    message: ''
  };

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private http: HttpClient,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    // Verificăm dacă utilizatorul este administrator
    this.isAdmin = this.authService.isAuthenticated();

    // Abonăm pentru a detecta schimbări în starea de autentificare
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;

      // Încărcăm lista de evenimente dacă utilizatorul este administrator
      if (isAuthenticated) {
        this.loadEvents();
      }
    });

    // Încărcăm lista de evenimente dacă utilizatorul este administrator
    if (this.isAdmin) {
      this.loadEvents();
    }

    // Ascultăm pentru evenimente de adăugare sau actualizare de evenimente
    window.addEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.addEventListener('eventUpdated', this.handleEventAdded.bind(this));
    
    // Ascultăm pentru click-uri pe evenimente (pentru înregistrare)
    if (!this.isAdmin) {
      window.addEventListener('eventClicked', this.handleEventClicked.bind(this));
    }
  }
  
  // Curățăm la distrugerea componentei
  ngOnDestroy() {
    window.removeEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.removeEventListener('eventUpdated', this.handleEventAdded.bind(this));
    window.removeEventListener('eventClicked', this.handleEventClicked.bind(this));
  }
  
  // Handler pentru evenimentul custom de adăugare eveniment
  handleEventAdded(e: any) {
    if (this.isAdmin) {
      this.loadEvents();
    }
  }

  // Handler pentru click pe eveniment (pentru afișarea detaliilor)
  handleEventClicked(e: any) {
    if (!this.isAdmin && e.detail) {
      this.loadFullEventDetails(e.detail);
    }
  }
  
  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe(data => {
      this.events = data;
    });
  }
  
  toggleEventsList() {
    this.showEventsList = !this.showEventsList;
  }
  
  editEvent(event: any) {
    // Convertim evenimentul în formatul așteptat de CalendarComponent
    const calendarEvent = {
      id: event.id,
      title: event.name,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      extendedProps: {
        description: event.description,
        location: event.location,
        images: event.images || []
      }
    };

    // Setăm evenimentul selectat în CalendarComponent
    this.calendarComponent.selectedEvent = calendarEvent;

    // Apelăm metoda de editare din CalendarComponent
    this.calendarComponent.editEvent();
  }
  
  deleteEvent(id: number) {
    if (confirm('Sigur vrei să ștergi acest eveniment?')) {
      this.http.delete(`http://localhost:8080/api/events/${id}`).subscribe(() => {
        alert('Eveniment șters cu succes!');
        this.loadEvents();
        
        // Emitem un eveniment pentru a notifica alte componente (calendar) despre ștergerea evenimentului
        const eventDeletedEvent = new CustomEvent('eventDeleted', { 
          detail: { eventId: id }
        });
        window.dispatchEvent(eventDeletedEvent);
      }, error => {
        console.error('Eroare la ștergerea evenimentului:', error);
        alert('Eroare la ștergerea evenimentului!');
      });
    }
  }

  // Metoda pentru deconectare
  logout() {
    this.authService.logout();
  }

  // Metoda pentru redirecționare către pagina de autentificare
  goToLogin() {
    this.router.navigate(['/administrator-login']);
  }

  // Metoda pentru afișarea detaliilor evenimentului
  showEventDetails(event: any) {
    this.selectedEvent = event;
    this.showEventDetailsModal = true;
  }

  // Metoda pentru afișarea modalului de înregistrare la eveniment
  showEventRegistration(event: any = null) {
    if (event) {
      this.selectedEvent = event;
    }
    this.showEventDetailsModal = false;
    this.showRegistrationModal = true;
    this.registrationForm = { nume: '', prenume: '', email: '' };
  }

  // Metoda pentru închiderea modalului de detalii
  closeEventDetailsModal() {
    this.showEventDetailsModal = false;
    this.selectedEvent = null;
  }

  // Metoda pentru deschiderea modalului cu imaginea
  openImageModal(image: any) {
    this.selectedImage = image;
    this.showImageModal = true;
  }

  // Metoda pentru închiderea modalului cu imaginea
  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  // Metoda pentru închiderea modalului de înregistrare
  closeRegistrationModal() {
    this.showRegistrationModal = false;
    if (!this.showEventDetailsModal) {
      this.selectedEvent = null;
    }
  }

  // Metoda pentru înscrierea la eveniment
  registerForEvent() {
    if (!this.selectedEvent || !this.registrationForm.nume.trim() || 
        !this.registrationForm.prenume.trim() || !this.registrationForm.email.trim()) {
      alert('Vă rugăm să completați toate câmpurile!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registrationForm.email)) {
      alert('Vă rugăm să introduceți o adresă de email validă!');
      return;
    }

    const registrationData = {
      evenimentId: this.selectedEvent.id,
      nume: this.registrationForm.nume.trim(),
      prenume: this.registrationForm.prenume.trim(),
      email: this.registrationForm.email.trim()
    };

    console.log('Trimitem datele de înregistrare:', registrationData);
    console.log('selectedEvent:', this.selectedEvent);

    this.http.post('http://localhost:8080/api/participants/inscriere', registrationData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showNotification('success', 'Înscrierea reușită!', 'Înscrierea s-a făcut cu succes! Veți primi un email cu invitația dumneavoastră.');
            this.closeRegistrationModal();
          } else {
            this.showNotification('error', 'Eroare la înscriere', response.message);
          }
        },
        error: (error) => {
          const message = error.error?.message || '';
          
          if (message.includes('deja inscris') || message.includes('deja înscris')) {
            this.showNotification('warning', 'Deja înscris', 'Sunteți deja înscris la acest eveniment! Verificați email-ul pentru invitația dumneavoastră.');
          } else {
            this.showNotification('error', 'Eroare', message || 'A apărut o eroare la înregistrare.');
          }
        }
      });
  }

  // Metodă pentru afișarea notificărilor
  showNotification(type: 'success' | 'error' | 'warning', title: string, message: string) {
    this.notification = {
      show: true,
      type: type,
      title: title,
      message: message
    };

    // Auto-hide după 5 secunde pentru success, 7 secunde pentru warning/error
    const hideAfter = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
      this.hideNotification();
    }, hideAfter);
  }

  // Metodă pentru ascunderea notificărilor
  hideNotification() {
    this.notification.show = false;
  }

  // Metode pentru calendarul inteligent
  onSmartCalendarEventSelected(event: any) {
    console.log('Event selected from smart calendar:', event);
    // Pentru participanți - preia detaliile complete ale evenimentului
    if (!this.isAdmin) {
      this.loadFullEventDetails(event);
    }
  }

  // Metodă pentru încărcarea detaliilor complete ale evenimentului
  loadFullEventDetails(calendarEvent: any) {
    this.http.get(`http://localhost:8080/api/events/${calendarEvent.id}`).subscribe({
      next: (fullEvent: any) => {
        console.log('Full event details loaded:', fullEvent);
        this.showEventDetails({
          ...fullEvent,
          participants: calendarEvent.participants,
          capacity: calendarEvent.capacity,
          availableSpots: calendarEvent.availableSpots,
          percentage: calendarEvent.percentage,
          status: calendarEvent.status
        });
      },
      error: (error) => {
        console.error('Error loading full event details:', error);
        this.showNotification('error', 'Eroare', 'Nu s-au putut încărca detaliile evenimentului.');
      }
    });
  }
}
