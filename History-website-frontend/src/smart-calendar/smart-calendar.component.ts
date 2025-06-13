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
  @Input() isReservationMode: boolean = false; 
  @Output() dateSelected = new EventEmitter<string>();
  @Output() dateTimeSelected = new EventEmitter<{date: string, time: string}>();
  @Output() closeCalendar = new EventEmitter<void>();

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth(); 
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


  loadCalendarDensity() {
    const year = this.currentYear;
    const month = this.currentMonth + 1;
    
    this.http.get<any>(`http://localhost:8080/api/bookings/calendar-density/${year}/${month}`)
      .subscribe({
        next: (data) => {
          this.densityData = data;
          this.generateCalendarDays(); 
        },
        error: (err) => {
          console.error('Eroare la încărcarea densității:', err);
        }
      });
  }

  generateCalendarDays() {
    this.calendarDays = [];
    
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; 
    
    for (let i = 0; i < startDayOfWeek; i++) {
      this.calendarDays.push({ day: '', isEmpty: true });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const currentDayDate = new Date(this.currentYear, this.currentMonth, day);
      const isPastOrToday = currentDayDate <= today;
      
      const dayData = this.densityData[dateStr] || { status: 'available', availableSlots: 0 };
      
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

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadCalendarDensity();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadCalendarDensity();
  }

  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.loadCalendarDensity();
  }

  onDayClick(dayData: any) {
    if (dayData.isEmpty || dayData.isPastOrToday) return;
    
    this.selectedDay = dayData;
    this.showDayDetails = true;
  }

  closeDayDetails() {
    this.showDayDetails = false;
    this.selectedDay = null;
  }

  onCloseCalendar() {
    this.closeCalendar.emit();
  }

  makeReservation(dateStr: string) {
    this.router.navigate(['/rezervari'], { 
      queryParams: { selectedDate: dateStr } 
    });
  }

  selectDate(dateStr: string) {
    this.dateSelected.emit(dateStr);
    this.closeDayDetails();
    this.closeCalendar.emit();
  }

  selectDateAndTime(dateStr: string, timeSlot: string) {
    this.dateTimeSelected.emit({ date: dateStr, time: timeSlot });
    this.closeDayDetails();
    this.closeCalendar.emit();
  }

  onTimeSlotClick(slot: any) {
    if (!this.isReservationMode) return;
    if (this.getSlotValue(slot.value) >= 2) return; 

    this.selectDateAndTime(this.selectedDay.dateStr, slot.key);
  }

  getDayClass(dayData: any): string {
    if (dayData.isEmpty) return 'empty-day';
    
    const baseClass = 'calendar-day';
    const statusClass = `day-${dayData.status}`;
    
    return `${baseClass} ${statusClass}`;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponibil (fără aglomerare)';
      case 'partial': return 'Parțial ocupat (aglomerare moderată)';
      case 'full': return 'Complet ocupat (toate intervalele pline)';
      case 'past': return 'Data depășită';
      default: return 'Necunoscut';
    }
  }

  getStatusEmoji(status: string): string {
    switch (status) {
      case 'available': return '✅';
      case 'partial': return '⚠️';
      case 'full': return '🔴';
      case 'past': return '🕰️';
      default: return '❓';
    }
  }

  getSlotValue(value: any): number {
    return Number(value) || 0;
  }

  calculateDayStatus(timeSlots: any): string {
    if (!timeSlots || Object.keys(timeSlots).length === 0) {
      return 'available';
    }

    const totalSlots = Object.keys(timeSlots).length;
    let occupiedSlots = 0;
    let fullSlots = 0;

    Object.values(timeSlots).forEach((value: any) => {
      const slotValue = this.getSlotValue(value);
      if (slotValue >= 1) {
        occupiedSlots++;
      }
      if (slotValue >= 2) {
        fullSlots++;
      }
    });

    if (fullSlots === totalSlots) {
      return 'full'; 
    } else if (occupiedSlots >= Math.ceil(totalSlots / 2) || fullSlots > 0) {
      return 'partial'; 
    } else {
      return 'available'; 
    }
  }
}