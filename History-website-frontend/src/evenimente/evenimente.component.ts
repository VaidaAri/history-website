import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CadranComponent } from "../cadran/cadran.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, MeniuComponent, CalendarComponent, CadranComponent, TranslatePipe],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css',
  providers: [TranslationService]
})
export class EvenimenteComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  events: any[] = [];
  showEventsList: boolean = false;

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
  }
  
  // Curățăm la distrugerea componentei
  ngOnDestroy() {
    window.removeEventListener('eventAdded', this.handleEventAdded.bind(this));
    window.removeEventListener('eventUpdated', this.handleEventAdded.bind(this));
  }
  
  // Handler pentru evenimentul custom de adăugare eveniment
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
}
