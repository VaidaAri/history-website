import { Component, OnInit } from '@angular/core';
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
      const dayData = this.densityData[dateStr] || { status: 'available', availableSlots: 0 };
      
      this.calendarDays.push({
        day: day,
        dateStr: dateStr,
        isEmpty: false,
        status: dayData.status,
        availableSlots: dayData.availableSlots,
        totalSlots: dayData.totalSlots,
        timeSlots: dayData.timeSlots,
        fullSlots: dayData.fullSlots,
        partialSlots: dayData.partialSlots,
        emptySlots: dayData.emptySlots
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
    if (dayData.isEmpty) return;
    
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
   * Navighează la pagina de rezervări pentru o zi specifică
   */
  makeReservation(dateStr: string) {
    this.router.navigate(['/rezervari'], { 
      queryParams: { selectedDate: dateStr } 
    });
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
      case 'available': return 'Complet disponibil';
      case 'partial': return 'Parțial ocupat';
      case 'full': return 'Complet ocupat';
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
      default: return '❓';
    }
  }

  /**
   * Helper pentru a converti slot.value la număr
   */
  getSlotValue(value: any): number {
    return Number(value) || 0;
  }
}