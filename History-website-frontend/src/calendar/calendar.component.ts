import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  isAdmin: boolean = false;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: false, // Va fi setat în funcție de autentificare
    selectMirror: true,
    events: [], // Inițial gol
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this) // Adăugăm event listener pentru selectare
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadEvents();
    
    // Verificăm dacă utilizatorul este administrator
    this.isAdmin = this.authService.isAuthenticated();
    
    // Actualizăm opțiunile calendarului în funcție de starea de autentificare
    this.updateCalendarPermissions();
    
    // Abonăm pentru a detecta schimbări în starea de autentificare
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
      this.updateCalendarPermissions();
    });
  }

  updateCalendarPermissions() {
    this.calendarOptions = { 
      ...this.calendarOptions, 
      selectable: this.isAdmin, // Doar admin poate selecta date
      events: this.events
    };
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe(data => {
      this.events = data.map(event => ({
        id: event.id,
        title: event.name,
        start: event.startDate,
        end: event.endDate,
        color: '#7D5A50'
      }));
      this.updateCalendar();
    });
  }

  updateCalendar() {
    this.calendarOptions = { 
      ...this.calendarOptions, 
      events: this.events 
    };
  }

  handleEventClick(info: any) {
    if (!this.isAdmin) {
      // Dacă nu este admin, se afișează doar detaliile evenimentului
      alert(`Eveniment: ${info.event.title}\nDată: ${new Date(info.event.start).toLocaleDateString()}`);
      return;
    }
    
    // Dacă este admin, se oferă opțiunea de ștergere
    const confirmDelete = confirm(`Sigur vrei să ștergi evenimentul: ${info.event.title}?`);
    if (confirmDelete) {
      const eventToDelete = this.events.find(event => event.title === info.event.title);
      if (eventToDelete) {
        this.http.delete(`http://localhost:8080/api/events/${eventToDelete.id}`).subscribe(() => {
          alert('Eveniment șters cu succes!');
          this.loadEvents();
        }, error => {
          alert('Eroare la ștergerea evenimentului!');
        });
      } else {
        alert('Nu s-a găsit ID-ul evenimentului!');
      }
    }
  }

  handleDateSelect(selectInfo: any) {
    if (!this.isAdmin) {
      return; // Dacă nu este admin, nu se întâmplă nimic
    }
    
    const eventName = prompt('Introdu numele evenimentului:');
    if (eventName) {
      const newEvent = {
        name: eventName,
        startDate: new Date(selectInfo.startStr).toISOString(),
        endDate: new Date(selectInfo.endStr).toISOString(),
        location: 'Muzeu'
      };
      this.http.post('http://localhost:8080/api/events', newEvent).subscribe(() => {
        alert('Eveniment adăugat cu succes!');
        this.loadEvents(); 
      }, error => {
        alert('Eroare la salvarea evenimentului!');
      });
    }
  }
}
