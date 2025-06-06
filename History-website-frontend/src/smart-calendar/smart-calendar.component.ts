import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smart-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smart-calendar.component.html',
  styleUrl: './smart-calendar.component.css'
})
export class SmartCalendarComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() selectedDate: string = '';
  @Input() isReservationMode: boolean = false; // true când e folosit în pagina de rezervări
  @Output() dateSelected = new EventEmitter<string>();
  @Output() dateTimeSelected = new EventEmitter<{date: string, time: string}>();
  @Output() closeCalendar = new EventEmitter<void>();

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth(); // 0-11
  calendarDays: any[] = [];
  densityData: any = {};
  monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];
  weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  selectedDay: any = null;
  showDayDetails = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCalendarDensity();
    this.generateCalendarDays();
  }

  /**
   * Încarcă densitatea rezervărilor pentru luna curentă
   */
  loadCalendarDensity() {
    const year = this.currentYear;
    const month = this.currentMonth + 1; // FullCalendar folosește 0-11, backend 1-12
    
    this.http.get<any>(`http://localhost:8080/api/bookings/calendar-density/${year}/${month}`)
      .subscribe({
        next: (data) => {
          this.densityData = data;
          this.generateCalendarDays(); // Regenerăm după primirea datelor
        },
        error: (err) => {
          console.error('Eroare la încărcarea densității:', err);
        }
      });
  }

  /**
   * Generează zilele pentru calendar
   */
  generateCalendarDays() {
    this.calendarDays = [];
    
    // Prima zi a lunii
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    // Ultima zi a lunii
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Ziua curentă pentru comparație
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetăm ora pentru comparație precisă
    
    // Ziua săptămânii pentru prima zi (0 = duminică, convertim la 0 = luni)
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Convertim duminica de la 0 la 6
    
    // Adăugăm zilele goale la început
    for (let i = 0; i < startDayOfWeek; i++) {
      this.calendarDays.push({ day: '', isEmpty: true });
    }
    
    // Adăugăm zilele lunii
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const currentDayDate = new Date(this.currentYear, this.currentMonth, day);
      const isPastOrToday = currentDayDate <= today;
      
      const dayData = this.densityData[dateStr] || { status: 'available', availableSlots: 0 };
      
      // Calculăm statusul bazat pe procentajul de intervale ocupate
      let calculatedStatus = 'available';
      if (!isPastOrToday && dayData.timeSlots) {
        calculatedStatus = this.calculateDayStatus(dayData.timeSlots);
      }
      
      this.calendarDays.push({
        day: day,
        dateStr: dateStr,
        isEmpty: false,
        status: isPastOrToday ? 'past' : calculatedStatus,
        availableSlots: isPastOrToday ? 0 : dayData.availableSlots,
        totalSlots: dayData.totalSlots,
        timeSlots: dayData.timeSlots,
        fullSlots: dayData.fullSlots,
        partialSlots: dayData.partialSlots,
        emptySlots: dayData.emptySlots,
        isPastOrToday: isPastOrToday
      });
    }
  }

  /**
   * Navighează la luna anterioară
   */
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadCalendarDensity();
  }

  /**
   * Navighează la luna următoare
   */
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadCalendarDensity();
  }

  /**
   * Navighează la luna curentă
   */
  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.loadCalendarDensity();
  }

  /**
   * Click pe o zi din calendar
   */
  onDayClick(dayData: any) {
    if (dayData.isEmpty || dayData.isPastOrToday) return;
    
    // Afișăm detaliile doar pentru zilele viitoare
    this.selectedDay = dayData;
    this.showDayDetails = true;
  }

  /**
   * Închide popup-ul cu detalii
   */
  closeDayDetails() {
    this.showDayDetails = false;
    this.selectedDay = null;
  }

  /**
   * Închide calendarul
   */
  onCloseCalendar() {
    this.closeCalendar.emit();
  }

  /**
   * Navighează la pagina de rezervări pentru o zi specifică (doar pentru modul standalone)
   */
  makeReservation(dateStr: string) {
    // Doar pentru modul standalone, când nu e folosit ca popup pentru rezervări
    this.router.navigate(['/rezervari'], { 
      queryParams: { selectedDate: dateStr } 
    });
  }

  /**
   * Selectează data și închide calendarul (pentru modul popup în rezervări)
   */
  selectDate(dateStr: string) {
    this.dateSelected.emit(dateStr);
    this.closeDayDetails();
    this.closeCalendar.emit();
  }

  /**
   * Selectează data și ora și închide calendarul
   */
  selectDateAndTime(dateStr: string, timeSlot: string) {
    this.dateTimeSelected.emit({ date: dateStr, time: timeSlot });
    this.closeDayDetails();
    this.closeCalendar.emit();
  }

  /**
   * Gestionează click-ul pe un slot orar
   */
  onTimeSlotClick(slot: any) {
    if (!this.isReservationMode) return;
    if (this.getSlotValue(slot.value) >= 2) return; // Slot ocupat

    this.selectDateAndTime(this.selectedDay.dateStr, slot.key);
  }

  /**
   * Obține clasa CSS pentru o zi în funcție de status
   */
  getDayClass(dayData: any): string {
    if (dayData.isEmpty) return 'empty-day';
    
    const baseClass = 'calendar-day';
    const statusClass = `day-${dayData.status}`;
    
    return `${baseClass} ${statusClass}`;
  }

  /**
   * Obține textul descriptiv pentru status
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponibil (fără aglomerare)';
      case 'partial': return 'Parțial ocupat (aglomerare moderată)';
      case 'full': return 'Complet ocupat (toate intervalele pline)';
      case 'past': return 'Data depășită';
      default: return 'Necunoscut';
    }
  }

  /**
   * Obține emoji-ul pentru status
   */
  getStatusEmoji(status: string): string {
    switch (status) {
      case 'available': return '✅';
      case 'partial': return '⚠️';
      case 'full': return '🔴';
      case 'past': return '🕰️';
      default: return '❓';
    }
  }

  /**
   * Helper pentru a converti slot.value la număr
   */
  getSlotValue(value: any): number {
    return Number(value) || 0;
  }

  /**
   * Calculează statusul unei zile bazat pe procentajul de intervale ocupate
   */
  calculateDayStatus(timeSlots: any): string {
    if (!timeSlots || Object.keys(timeSlots).length === 0) {
      return 'available';
    }

    const totalSlots = Object.keys(timeSlots).length;
    let occupiedSlots = 0;
    let fullSlots = 0;

    // Numărăm intervalele ocupate și pline
    Object.values(timeSlots).forEach((value: any) => {
      const slotValue = this.getSlotValue(value);
      if (slotValue >= 1) {
        occupiedSlots++;
      }
      if (slotValue >= 2) {
        fullSlots++;
      }
    });

    // Logica actualizată: 
    // - Roșu: 100% din intervale sunt pline (2/2 rezervări)
    // - Galben: ≥50% din intervale au cel puțin 1 rezervare SAU cel puțin un interval complet plin
    // - Verde: <50% din intervale au rezervări ȘI niciun interval complet plin
    
    if (fullSlots === totalSlots) {
      return 'full'; // Toate intervalele sunt pline (2/2)
    } else if (occupiedSlots >= Math.ceil(totalSlots / 2) || fullSlots > 0) {
      return 'partial'; // Cel puțin jumătate au rezervări SAU cel puțin un interval e complet plin
    } else {
      return 'available'; // Mai puțin de jumătate au rezervări și niciun interval complet plin
    }
  }
}