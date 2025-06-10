import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-smart-event-calendar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './smart-event-calendar.component.html',
  styleUrl: './smart-event-calendar.component.css'
})
export class SmartEventCalendarComponent implements OnInit {
  @Input() isVisible: boolean = true; // Always visible now
  @Input() isParticipantMode: boolean = false; // false = admin mode, true = participant mode
  @Input() maxCapacityPerEvent: number = 100;
  @Input() isEmbedded: boolean = false; // New: true for embedded mode, false for popup mode
  
  @Output() daySelected = new EventEmitter<any>();
  @Output() eventSelected = new EventEmitter<any>();
  @Output() closeCalendar = new EventEmitter<void>();

  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  calendarDays: any[] = [];
  densityData: any = {};
  isLoading: boolean = false;
  
  selectedDayData: any = null;
  showDayDetails: boolean = false;

  readonly monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  readonly dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEventDensity();
  }

  loadEventDensity() {
    this.isLoading = true;
    const url = `http://localhost:8080/api/events/calendar-density/${this.currentYear}/${this.currentMonth}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.densityData = data;
        this.generateCalendarDays();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event density:', error);
        this.isLoading = false;
      }
    });
  }

  generateCalendarDays() {
    this.calendarDays = [];
    
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);
    
    // Convertim de la Duminică=0 la Luni=0
    let firstDayWeek = firstDay.getDay();
    firstDayWeek = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
    
    // Adăugăm zile goale la început
    for (let i = 0; i < firstDayWeek; i++) {
      this.calendarDays.push({ day: '', isEmpty: true });
    }
    
    // Adăugăm zilele din lună
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = this.densityData[dateStr] || { status: 'no-events', events: [], totalEvents: 0 };
      
      const today = new Date();
      const currentDate = new Date(this.currentYear, this.currentMonth - 1, day);
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      this.calendarDays.push({
        day: day,
        date: dateStr,
        isEmpty: false,
        isPast: isPast,
        status: isPast ? 'past' : dayData.status,
        season: this.getSeason(this.currentMonth),
        events: dayData.events || [],
        totalEvents: dayData.totalEvents || 0,
        fullEvents: dayData.fullEvents || 0,
        partialEvents: dayData.partialEvents || 0,
        availableEvents: dayData.availableEvents || 0,
        totalAvailableSpots: dayData.totalAvailableSpots || 0
      });
    }
  }

  previousMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadEventDensity();
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadEventDensity();
  }

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth() + 1;
    this.currentYear = today.getFullYear();
    this.loadEventDensity();
  }

  onDayClick(dayData: any) {
    if (dayData.isEmpty || dayData.isPast) {
      return;
    }

    if (dayData.totalEvents === 0) {
      // Zi fără evenimente
      if (!this.isParticipantMode) {
        // Admin poate crea evenimente
        this.daySelected.emit({
          date: dayData.date,
          canCreateEvent: true
        });
      }
      return;
    }

    // În modul embedded pentru participanți, dacă ziua are un singur eveniment, îl deschidem direct
    if (this.isEmbedded && this.isParticipantMode && dayData.events.length === 1) {
      this.onEventClick(dayData.events[0]);
      return;
    }

    // Zi cu evenimente - afișăm popup cu detalii doar în modul non-embedded
    if (!this.isEmbedded) {
      this.selectedDayData = dayData;
      this.showDayDetails = true;
    }
  }

  onEventClick(event: any) {
    this.eventSelected.emit(event);
    if (!this.isEmbedded) {
      this.closeDayDetails();
    }
  }

  closeDayDetails() {
    this.showDayDetails = false;
    this.selectedDayData = null;
  }

  closeModal() {
    this.closeCalendar.emit();
  }

  getDayStatusClass(dayData: any): string {
    if (dayData.isEmpty) return '';
    if (dayData.isPast) return 'past-day';
    
    // Returnăm clasa sezonieră pentru zilele normale
    return `season-${dayData.season}`;
  }

  getSeason(month: number): string {
    if (month >= 3 && month <= 5) return 'spring';    // Primăvara: Martie-Mai
    if (month >= 6 && month <= 8) return 'summer';    // Vara: Iunie-August  
    if (month >= 9 && month <= 11) return 'autumn';   // Toamna: Septembrie-Noiembrie
    return 'winter';                                  // Iarna: Decembrie-Februarie
  }

  getEventStatusClass(event: any): string {
    switch (event.status) {
      case 'available': return 'event-available';
      case 'very-low': return 'event-very-low';
      case 'low': return 'event-low';
      case 'medium': return 'event-medium';
      case 'high': return 'event-high';
      case 'very-high': return 'event-very-high';
      case 'full': return 'event-full';
      default: return '';
    }
  }

  getEventStatusMessage(event: any): string {
    const remaining = event.availableSpots;
    
    if (remaining === 0) return 'Eveniment complet';
    if (remaining <= 5) return `Doar ${remaining} locuri rămase!`;
    if (remaining <= 15) return `${remaining} locuri disponibile`;
    return 'Multe locuri disponibile';
  }

  canParticipate(event: any): boolean {
    return this.isParticipantMode && event.status !== 'full' && !this.selectedDayData?.isPast;
  }

  getMonthName(): string {
    return this.monthNames[this.currentMonth - 1];
  }
}