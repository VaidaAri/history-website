import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  
  // Constante pentru limitele de date 
  readonly MONTHS_IN_PAST = 3; // Număr de luni în trecut din anul curent
  readonly MONTHS_IN_FUTURE = 12; // Număr de luni în viitor
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: false, // Va fi setat în funcție de autentificare
    selectMirror: true,
    events: [], // Inițial gol
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this), // Adăugăm event listener pentru selectare
    
    // Restricționăm intervalul vizibil în calendar
    validRange: this.getValidDateRange(),
    
    // Butoane pentru navigare și titlu
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridYear'
    },
    
    // Localizare pentru română
    locale: 'ro',
    
    // Nu permitem utilizatorilor să navigheze în afara intervalului valid
    fixedWeekCount: false
  };

  // Validator pentru verificarea ordinii corecte a datelor și a intervalului valid
  private dateOrderValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get('startDate')?.value;
      const endDate = control.get('endDate')?.value;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Verifică ordinea datelor
        if (end < start) {
          return { 'dateOrder': true };
        }
        
        // Verifică dacă datele sunt în intervalul valid
        const validRange = this.getValidDateRange();
        
        if (start < validRange.start) {
          return { 'startDateOutOfRange': true };
        }
        
        if (end > validRange.end) {
          return { 'endDateOutOfRange': true };
        }
      }
      
      return null;
    };
  }
  
  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inițializăm formularul cu validatori
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      eventType: ['eveniment'], // Default la eveniment normal
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }, {
      validators: [this.dateOrderValidator()]
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
    
    // Formatăm datele pentru input[type="date"] (YYYY-MM-DD)
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    
    // Verificăm dacă datele sunt în intervalul valid
    const validRange = this.getValidDateRange();
    if (startDate < validRange.start || endDate > validRange.end) {
      alert(`Poți selecta doar date între ${this.formatDate(validRange.start.toISOString())} și ${this.formatDate(validRange.end.toISOString())}`);
      return;
    }
    
    // Stocăm informațiile despre data selectată și deschidem modalul
    this.selectedDateInfo = selectInfo;
    this.showEventModal = true;
    
    // Dacă sunt date în viitor, scădem o zi din data de sfârșit
    // deoarece FullCalendar returnează ziua următoare pentru selecție
    if (endDate > startDate) {
      endDate.setDate(endDate.getDate() - 1);
    }
    
    // Resetăm formularul cu date inițiale
    this.eventForm.reset({
      name: '',
      eventType: 'eveniment',
      startDate: this.formatDateForInput(startDate),
      endDate: this.formatDateForInput(endDate)
    });
  }
  
  // Formatăm data pentru input[type="date"] (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  
  // Definește intervalul valid pentru calendar
  getValidDateRange() {
    const today = new Date();
    
    // Data minimă: acum X luni în trecut
    const minDate = new Date(today);
    minDate.setMonth(today.getMonth() - this.MONTHS_IN_PAST);
    minDate.setDate(1); // La începutul lunii
    
    // Data maximă: acum Y luni în viitor
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + this.MONTHS_IN_FUTURE);
    maxDate.setDate(0); // Ultima zi a lunii
    
    return {
      start: minDate,
      end: maxDate
    };
  }
  
  // Verifică dacă o dată este în intervalul valid
  isDateInValidRange(date: Date): boolean {
    const range = this.getValidDateRange();
    return date >= range.start && date <= range.end;
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
    // Ajustăm data de sfârșit pentru a include întreaga zi
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    // Setăm ora pentru data de sfârșit la 23:59:59 pentru a include toată ziua
    endDate.setHours(23, 59, 59, 999);
    
    const newEvent = {
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
    // Ajustăm data de sfârșit pentru a include întreaga zi
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    // Setăm ora pentru data de sfârșit la 23:59:59 pentru a include toată ziua
    endDate.setHours(23, 59, 59, 999);
    
    const newExhibition = {
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
