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
  
  eventStats = {
    nextEvent: null as any,
    popularEvent: null as any,
    totalEventsThisMonth: 0,
    totalAvailableSpots: 0,
    fullEvents: 0
  };
  
  statsLoaded = false;
  
  registrationForm = {
    nume: '',
    prenume: '',
    email: ''
  };
  
  notification = {
    show: false,
    type: 'success', 
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
    this.isAdmin = this.authService.isAuthenticated();

    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;

      if (isAuthenticated) {
        this.loadEvents();
      }
    });

    if (this.isAdmin) {
      this.loadEvents();
    }
    
    this.loadEventStats();

    window.addEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.addEventListener('eventUpdated', this.handleEventAdded.bind(this));
    
    if (!this.isAdmin) {
      window.addEventListener('eventClicked', this.handleEventClicked.bind(this));
    }
  }
  
  ngOnDestroy() {
    window.removeEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.removeEventListener('eventUpdated', this.handleEventAdded.bind(this));
    window.removeEventListener('eventClicked', this.handleEventClicked.bind(this));
  }
  
  handleEventAdded(e: any) {
    if (this.isAdmin) {
      this.loadEvents();
    }
  }

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

    this.calendarComponent.selectedEvent = calendarEvent;

    this.calendarComponent.editEvent();
  }
  
  deleteEvent(id: number) {
    if (confirm('Sigur vrei să ștergi acest eveniment?')) {
      this.http.delete(`http://localhost:8080/api/events/${id}`).subscribe(() => {
        alert('Eveniment șters cu succes!');
        this.loadEvents();
        
        const eventDeletedEvent = new CustomEvent('eventDeleted', { 
          detail: { eventId: id }
        });
        window.dispatchEvent(eventDeletedEvent);
      }, error => {
        alert('Eroare la ștergerea evenimentului!');
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  goToLogin() {
    this.router.navigate(['/administrator-login']);
  }

  showEventDetails(event: any) {
    this.selectedEvent = event;
    this.showEventDetailsModal = true;
  }

  showEventRegistration(event: any = null) {
    if (event) {
      this.selectedEvent = event;
    }
    this.showEventDetailsModal = false;
    this.showRegistrationModal = true;
    this.registrationForm = { nume: '', prenume: '', email: '' };
  }

  closeEventDetailsModal() {
    this.showEventDetailsModal = false;
    this.selectedEvent = null;
  }

  openImageModal(image: any) {
    this.selectedImage = image;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  closeRegistrationModal() {
    this.showRegistrationModal = false;
    if (!this.showEventDetailsModal) {
      this.selectedEvent = null;
    }
  }

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

  showNotification(type: 'success' | 'error' | 'warning', title: string, message: string) {
    this.notification = {
      show: true,
      type: type,
      title: title,
      message: message
    };

    const hideAfter = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
      this.hideNotification();
    }, hideAfter);
  }

  hideNotification() {
    this.notification.show = false;
  }

  onSmartCalendarEventSelected(event: any) {
    if (!this.isAdmin) {
      this.loadFullEventDetails(event);
    }
  }

  loadFullEventDetails(calendarEvent: any) {
    this.http.get(`http://localhost:8080/api/events/${calendarEvent.id}`).subscribe({
      next: (fullEvent: any) => {
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
        this.showNotification('error', 'Eroare', 'Nu s-au putut încărca detaliile evenimentului.');
      }
    });
  }

  loadEventStats() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    
    this.http.get<any>(`http://localhost:8080/api/events/calendar-density/${currentYear}/${currentMonth}`).subscribe({
      next: (densityData) => {
        this.calculateStatsFromDensity(densityData);
      },
      error: (error) => {
        this.showNotification('error', 'Eroare', 'Nu s-au putut încărca statisticile evenimentelor.');
      }
    });
    
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe({
      next: (allEvents) => {
        this.findNextAndPopularEvents(allEvents);
      },
      error: (error) => {
        this.showNotification('error', 'Eroare', 'Nu s-au putut încărca evenimentele.');
      }
    });
  }

  calculateStatsFromDensity(densityData: any) {
    let totalEvents = 0;
    let totalAvailable = 0;
    let fullEvents = 0;
    
    Object.values(densityData).forEach((dayData: any) => {
      if (dayData.events && Array.isArray(dayData.events)) {
        totalEvents += dayData.events.length;
        
        dayData.events.forEach((event: any) => {
          totalAvailable += event.availableSpots || 0;
          
          if (event.status === 'full' || event.status === 'very-high') {
            fullEvents++;
          }
        });
      }
    });
    
    this.eventStats.totalEventsThisMonth = totalEvents;
    this.eventStats.totalAvailableSpots = totalAvailable;
    this.eventStats.fullEvents = fullEvents;
    this.statsLoaded = true;
    
  }

  findNextAndPopularEvents(allEvents: any[]) {
    const now = new Date();
    
    const futureEvents = allEvents
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    this.eventStats.nextEvent = futureEvents.length > 0 ? futureEvents[0] : null;

    const popularEvents = allEvents
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => b.id - a.id);
    
    this.eventStats.popularEvent = popularEvents.length > 0 ? popularEvents[0] : null;
  }

  scrollToCalendarAndHighlight(eventDate?: string) {
    const calendarElement = document.querySelector('.calendar-container');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
