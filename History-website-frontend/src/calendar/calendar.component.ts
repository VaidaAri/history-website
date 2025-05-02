import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  isAdmin: boolean = false;
  showEventModal: boolean = false;
  selectedDateInfo: any = null;
  eventForm: FormGroup;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: false, // Va fi setat în funcție de autentificare
    selectMirror: true,
    events: [], // Inițial gol
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this) // Adăugăm event listener pentru selectare
  };

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inițializăm formularul
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      eventType: ['eveniment'] // Default la eveniment normal
    });
  }

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
      this.events = data.map(event => {
        // Creăm un obiect Date din string-ul ISO
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        return {
          id: event.id,
          title: event.name,
          start: startDate,
          end: endDate,
          color: '#7D5A50',
          allDay: true // Setăm evenimentele ca fiind "all day" pentru a evita afișarea orei
        };
      });
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
    
    // Stocăm informațiile despre data selectată și deschidem modalul
    this.selectedDateInfo = selectInfo;
    this.showEventModal = true;
    
    // Resetăm formularul
    this.eventForm.reset({
      name: '',
      eventType: 'eveniment'
    });
  }
  
  // Formatăm data pentru afișare
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Închidem modalul
  closeModal() {
    this.showEventModal = false;
    this.selectedDateInfo = null;
  }
  
  // Salvăm evenimentul
  saveEvent() {
    if (this.eventForm.invalid || !this.selectedDateInfo) {
      return;
    }
    
    const formValue = this.eventForm.value;
    const eventType = formValue.eventType;
    
    if (eventType === 'eveniment') {
      this.saveRegularEvent(formValue);
    } else if (eventType === 'expozitie') {
      this.saveExhibition(formValue);
    }
  }
  
  // Salvăm eveniment normal
  saveRegularEvent(formValue: any) {
    const newEvent = {
      name: formValue.name,
      startDate: new Date(this.selectedDateInfo.startStr).toISOString(),
      endDate: new Date(this.selectedDateInfo.endStr).toISOString(),
      location: 'Muzeu'
    };
    
    this.http.post('http://localhost:8080/api/events', newEvent).subscribe(() => {
      alert('Eveniment adăugat cu succes!');
      this.loadEvents();
      this.closeModal();
    }, error => {
      alert('Eroare la salvarea evenimentului!');
    });
  }
  
  // Salvăm expoziție
  saveExhibition(formValue: any) {
    const newExhibition = {
      name: formValue.name,
      startDate: new Date(this.selectedDateInfo.startStr).toISOString(),
      endDate: new Date(this.selectedDateInfo.endStr).toISOString(),
      location: 'Muzeu',
      tip: 'TEMPORARA' // Implicit temporară
    };
    
    this.http.post('http://localhost:8080/api/exhibitions', newExhibition).subscribe(() => {
      alert('Expoziție adăugată cu succes!');
      this.loadEvents();
      this.closeModal();
    }, error => {
      alert('Eroare la salvarea expoziției!');
    });
  }
}
