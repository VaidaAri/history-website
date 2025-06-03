import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CalendarComponent implements OnInit, OnDestroy {
  events: any[] = [];
  isAdmin: boolean = false;
  showEventModal: boolean = false;
  showEventDetailsModal: boolean = false;
  showEditEventModal: boolean = false;
  selectedDateInfo: any = null;
  selectedEvent: any = null;
  eventForm: FormGroup;
  editEventForm: FormGroup;
  selectedImages: { path: string, description?: string }[] = [];
  editEventImages: { path: string, description?: string }[] = [];
  selectedFile: File | null = null;
  editSelectedFile: File | null = null;
  uploadProgress: number = 0;
  editUploadProgress: number = 0;
  currentImageIndex: number = 0;
  selectedEventId: string | null = null;
  
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
      right: ''
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
      description: [''],
      location: [''],
      eventType: ['eveniment'],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      imagePath: ['']
    }, {
      validators: [this.dateOrderValidator()]
    });

    this.editEventForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      location: [''],
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
    
    // Ascultăm pentru evenimentul de ștergere a unui eveniment din listă
    window.addEventListener('eventDeleted', this.handleEventDeleted.bind(this));
  }
  
  ngOnDestroy() {
    // Curățăm event listener la distrugerea componentei
    window.removeEventListener('eventDeleted', this.handleEventDeleted.bind(this));
  }
  
  // Handler pentru evenimentul de ștergere eveniment
  handleEventDeleted(e: any) {
    console.log('Event deleted event received in calendar:', e.detail);
    // Actualizăm lista de evenimente pentru a reflecta schimbarea
    this.loadEvents();
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
    this.uploadProgress = 0;
  }
  
  uploadImage() {
    if (!this.selectedFile) {
      return;
    }
    
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('description', 'Imagine eveniment');
    
    this.uploadProgress = 10;
    
    this.http.post<any>('http://localhost:8080/api/images/upload-image', formData).subscribe(
      (response) => {
        this.uploadProgress = 100;
        if (response && response.imagePath) {
          this.selectedImages.push({ path: response.imagePath });
          this.selectedFile = null;
          setTimeout(() => this.uploadProgress = 0, 1000);
        }
      },
      (error) => {
        console.error('Eroare la încărcarea imaginii:', error);
        alert('Eroare la încărcarea imaginii. Vă rugăm să încercați din nou.');
        this.uploadProgress = 0;
      }
    );
  }
  
  cancelUpload() {
    this.selectedFile = null;
    this.uploadProgress = 0;
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
          allDay: true,
          description: event.description,
          location: event.location,
          images: event.images
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
    // Deschide modalul de detalii eveniment în loc de alert
    this.selectedEvent = info.event;
    this.currentImageIndex = 0; // Reset image index when opening a new event
    this.showEventDetailsModal = true;
    return;
  }
  
  closeEventDetailsModal() {
    this.showEventDetailsModal = false;
    this.selectedEvent = null;
    this.currentImageIndex = 0;
  }

  nextImage() {
    if (this.selectedEvent?.extendedProps?.images && this.currentImageIndex < this.selectedEvent.extendedProps.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  editEvent() {
    if (!this.selectedEvent || !this.isAdmin) {
      return;
    }

    this.selectedEventId = this.selectedEvent.id;

    // Populează formularul cu datele evenimentului selectat
    const startDate = new Date(this.selectedEvent.start);
    const endDate = new Date(this.selectedEvent.end);

    this.editEventForm.reset({
      name: this.selectedEvent.title,
      description: this.selectedEvent.extendedProps?.description || '',
      location: this.selectedEvent.extendedProps?.location || '',
      startDate: this.formatDateForInput(startDate),
      endDate: this.formatDateForInput(endDate)
    });

    // Copiază imaginile existente
    this.editEventImages = [];
    if (this.selectedEvent.extendedProps?.images) {
      this.editEventImages = [...this.selectedEvent.extendedProps.images];
    }

    // Ascunde modalul de detalii și arată pe cel de editare
    this.showEventDetailsModal = false;
    this.showEditEventModal = true;
  }

  closeEditModal() {
    this.showEditEventModal = false;
    this.editEventImages = [];
    this.editSelectedFile = null;
    this.editUploadProgress = 0;
    this.selectedEventId = null;
  }

  onEditFileSelected(event: any) {
    this.editSelectedFile = event.target.files[0] || null;
    this.editUploadProgress = 0;
  }

  uploadEditImage() {
    if (!this.editSelectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.editSelectedFile);
    formData.append('description', 'Imagine eveniment');

    this.editUploadProgress = 10;

    this.http.post<any>('http://localhost:8080/api/images/upload-image', formData).subscribe(
      (response) => {
        this.editUploadProgress = 100;
        if (response && response.imagePath) {
          this.editEventImages.push({ path: response.imagePath });
          this.editSelectedFile = null;
          setTimeout(() => this.editUploadProgress = 0, 1000);
        }
      },
      (error) => {
        console.error('Eroare la încărcarea imaginii:', error);
        alert('Eroare la încărcarea imaginii. Vă rugăm să încercați din nou.');
        this.editUploadProgress = 0;
      }
    );
  }

  cancelEditUpload() {
    this.editSelectedFile = null;
    this.editUploadProgress = 0;
  }

  removeEditImage(index: number) {
    if (index >= 0 && index < this.editEventImages.length) {
      this.editEventImages.splice(index, 1);
    }
  }

  saveEditedEvent() {
    if (this.editEventForm.invalid || !this.selectedEventId) {
      return;
    }

    const formValue = this.editEventForm.value;
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);

    endDate.setHours(23, 59, 59, 999);

    // Convertim obiectele imagine în formatul așteptat de backend
    const processedImages = this.editEventImages.map(img => {
      return {
        path: img.path,
        description: img.description || 'Imagine eveniment'
      };
    });

    const updatedEvent = {
      id: this.selectedEventId,
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: formValue.location || '',
      description: formValue.description || '',
      images: processedImages
    };

    // Adăugăm id-ul în URL pentru a corespunde cu endpoint-ul din backend
    this.http.put(`http://localhost:8080/api/events/${this.selectedEventId}`, updatedEvent).subscribe(() => {
      alert('Eveniment actualizat cu succes!');
      this.loadEvents();
      this.closeEditModal();

      // Emitem un eveniment custom pentru a notifica alte componente despre actualizarea unui eveniment
      const eventUpdatedEvent = new CustomEvent('eventUpdated', {
        detail: { event: updatedEvent }
      });
      window.dispatchEvent(eventUpdatedEvent);
    }, error => {
      alert('Eroare la actualizarea evenimentului!');
    });
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
      description: '',
      location: '',
      eventType: 'eveniment',
      startDate: this.formatDateForInput(startDate),
      endDate: this.formatDateForInput(endDate),
      imagePath: ''
    });
    
    this.selectedImages = [];
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
    this.selectedImages = [];
    this.selectedFile = null;
    this.uploadProgress = 0;
  }
  
  // Metoda nu mai este necesară, am înlocuit-o cu uploadImage()
  // Păstrăm totuși metoda pentru compatibilitate în caz că este apelată undeva în cod
  addImage() {
    if (this.selectedFile) {
      this.uploadImage();
    }
  }
  
  removeImage(index: number) {
    if (index >= 0 && index < this.selectedImages.length) {
      this.selectedImages.splice(index, 1);
    }
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
    
    // Convertim obiectele imagine în formatul așteptat de backend
    const processedImages = this.selectedImages.map(img => {
      return {
        path: img.path,
        description: img.description || 'Imagine eveniment'
      };
    });
    
    const newEvent = {
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: formValue.location || '',
      description: formValue.description || '',
      images: processedImages
    };
    
    this.http.post('http://localhost:8080/api/events', newEvent).subscribe(() => {
      alert('Eveniment adăugat cu succes!');
      this.loadEvents();
      this.closeModal();
      
      // Emitem un eveniment custom pentru a notifica alte componente despre adăugarea unui eveniment
      const eventAddedEvent = new CustomEvent('eventAdded', { 
        detail: { event: newEvent }
      });
      window.dispatchEvent(eventAddedEvent);
    }, error => {
      alert('Eroare la salvarea evenimentului!');
    });
  }
  
  saveExhibition(formValue: any) {
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    endDate.setHours(23, 59, 59, 999);
    
    // Convertim obiectele imagine în formatul așteptat de backend
    const processedImages = this.selectedImages.map(img => {
      return {
        path: img.path,
        description: img.description || 'Imagine expoziție'
      };
    });
    
    const newExhibition = {
      name: formValue.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: formValue.location || '',
      tip: 'TEMPORARA',
      description: formValue.description || '',
      images: processedImages
    };
    
    this.http.post('http://localhost:8080/api/exhibitions', newExhibition).subscribe(() => {
      alert('Expoziție adăugată cu succes!');
      this.loadEvents();
      this.closeModal();
      
      // Emitem un eveniment custom pentru a notifica alte componente despre adăugarea unei expoziții
      const eventAddedEvent = new CustomEvent('eventAdded', { 
        detail: { event: newExhibition }
      });
      window.dispatchEvent(eventAddedEvent);
    }, error => {
      alert('Eroare la salvarea expoziției!');
    });
  }
}
