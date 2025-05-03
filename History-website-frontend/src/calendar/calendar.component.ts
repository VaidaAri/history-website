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
  
  readonly MONTHS_IN_PAST = 3;
  readonly MONTHS_IN_FUTURE = 12;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: false,
    selectMirror: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    validRange: this.getValidDateRange(),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridYear'
    },
    locale: 'ro',
    fixedWeekCount: false
  };

  private dateOrderValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get('startDate')?.value;
      const endDate = control.get('endDate')?.value;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
          return { 'dateOrder': true };
        }
        
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
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      eventType: ['eveniment'],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }, {
      validators: [this.dateOrderValidator()]
    });
  }

  ngOnInit() {
    this.loadEvents();
    this.isAdmin = this.authService.isAuthenticated();
    this.updateCalendarPermissions();
    
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
      this.updateCalendarPermissions();
    });
  }

  updateCalendarPermissions() {
    this.calendarOptions = { 
      ...this.calendarOptions, 
      selectable: this.isAdmin,
      events: this.events
    };
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe(data => {
      this.events = data.map(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        return {
          id: event.id,
          title: event.name,
          start: startDate,
          end: endDate,
          color: '#7D5A50',
          allDay: true
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
      alert(`Eveniment: ${info.event.title}\nDată: ${new Date(info.event.start).toLocaleDateString()}`);
      return;
    }
    
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
      return;
    }
    
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    
    const validRange = this.getValidDateRange();
    if (startDate < validRange.start || endDate > validRange.end) {
      alert(`Poți selecta doar date între ${this.formatDate(validRange.start.toISOString())} și ${this.formatDate(validRange.end.toISOString())}`);
      return;
    }
    
    this.selectedDateInfo = selectInfo;
    this.showEventModal = true;
    
    if (endDate > startDate) {
      endDate.setDate(endDate.getDate() - 1);
    }
    
    this.eventForm.reset({
      name: '',
      eventType: 'eveniment',
      startDate: this.formatDateForInput(startDate),
      endDate: this.formatDateForInput(endDate)
    });
  }
  
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  getValidDateRange() {
    const today = new Date();
    
    const minDate = new Date(today);
    minDate.setMonth(today.getMonth() - this.MONTHS_IN_PAST);
    minDate.setDate(1);
    
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + this.MONTHS_IN_FUTURE);
    maxDate.setDate(0);
    
    return {
      start: minDate,
      end: maxDate
    };
  }
  
  isDateInValidRange(date: Date): boolean {
    const range = this.getValidDateRange();
    return date >= range.start && date <= range.end;
  }
  
  closeModal() {
    this.showEventModal = false;
    this.selectedDateInfo = null;
  }
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
  
  saveRegularEvent(formValue: any) {
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
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
  
  saveExhibition(formValue: any) {
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    endDate.setHours(23, 59, 59, 999);
    
    const newExhibition = {
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: 'Muzeu',
      tip: 'TEMPORARA'
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
