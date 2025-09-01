import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CadranComponent } from "../cadran/cadran.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MeniuComponent, CalendarComponent, CadranComponent, TranslatePipe],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css',
  providers: [TranslationService]
})
export class EvenimenteComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  events: any[] = [];
  showEventsList: boolean = false;
  
  
  selectedEvent: any = null;
  showEventDetailsModal: boolean = false;
  showImageModal: boolean = false;
  selectedImage: any = null;
  
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
    private translationService: TranslationService,
    private notificationService: NotificationService
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
    

    window.addEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.addEventListener('eventUpdated', this.handleEventAdded.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.removeEventListener('eventUpdated', this.handleEventAdded.bind(this));
  }
  
  handleEventAdded(e: any) {
    if (this.isAdmin) {
      this.loadEvents();
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


  loadFullEventDetails(calendarEvent: any) {
    this.http.get(`http://localhost:8080/api/events/${calendarEvent.id}`).subscribe({
      next: (fullEvent: any) => {
        this.showEventDetails(fullEvent);
      },
      error: (error) => {
        this.notificationService.showError('Eroare încărcare', 'Nu s-au putut încărca detaliile evenimentului.');
      }
    });
  }

  isEventExpired(event: any): boolean {
    if (!event || !event.endDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventEndDate = new Date(event.endDate);
    eventEndDate.setHours(0, 0, 0, 0);
    
    return eventEndDate < today;
  }



  scrollToCalendarAndHighlight(eventDate?: string) {
    const calendarElement = document.querySelector('.calendar-container');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
