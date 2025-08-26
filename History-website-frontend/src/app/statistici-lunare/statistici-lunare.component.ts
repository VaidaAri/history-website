import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MeniuComponent } from '../../meniu/meniu.component';

@Component({
  selector: 'app-statistici-lunare',
  standalone: true,
  imports: [MeniuComponent, CommonModule],
  templateUrl: './statistici-lunare.component.html',
  styleUrl: './statistici-lunare.component.css'
})
export class StatisticiLunareComponent implements OnInit {
  currentSection: string = 'vizite';

  // Statistici Vizite
  totalReservations: number = 0;
  totalVisitors: number = 0;
  ageGroupStats: any[] = [];
  noAgeGroupCount: number = 0;
  noAgeGroupPercentage: number = 0;
  recentReservations: any[] = [];

  // Statistici Evenimente
  totalEvents: number = 0;
  upcomingEvents: number = 0;
  availableSpots: number = 0;
  eventsThisMonth: number = 0;
  totalParticipants: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVisitStatistics();
    this.loadEventStatistics();
  }

  changeSection(section: string) {
    this.currentSection = section;
  }

  loadVisitStatistics() {
    // Încărcăm rezervările
    this.http.get<any[]>('http://localhost:8080/api/bookings').subscribe({
      next: (reservations) => {
        this.totalReservations = reservations.length;
        this.totalVisitors = reservations.reduce((sum, res) => sum + (res.numberOfPersons || 0), 0);
        
        // Calculăm statisticile pe categorii de vârstă
        this.calculateAgeGroupStatistics(reservations);
        
        // Ultimele 5 rezervări
        this.recentReservations = reservations
          .sort((a, b) => new Date(b.createdAt || b.datetime).getTime() - new Date(a.createdAt || a.datetime).getTime())
          .slice(0, 5)
          .map(res => ({
            name: `${res.nume || res.name || ''} ${res.prenume || ''}`.trim(),
            numberOfPersons: res.numberOfPersons,
            date: this.formatDate(res.datetime),
            status: this.getStatusLabel(res.status)
          }));
      },
      error: (err) => {
        // Error handling for loading visit statistics can be implemented here
      }
    });
  }

  calculateAgeGroupStatistics(reservations: any[]) {
    // Grupăm rezervările pe categorii de vârstă
    const ageGroups: { [key: string]: number } = {};
    let noAgeGroup = 0;

    reservations.forEach(reservation => {
      const ageGroup = reservation.ageGroup;
      if (ageGroup && ageGroup.trim() !== '') {
        ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
      } else {
        noAgeGroup++;
      }
    });

    // Convertim în array pentru afișare
    const total = reservations.length;
    this.ageGroupStats = Object.entries(ageGroups).map(([group, count]) => ({
      label: this.getAgeGroupLabel(group),
      count: count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    this.noAgeGroupCount = noAgeGroup;
    this.noAgeGroupPercentage = total > 0 ? Math.round((noAgeGroup / total) * 100) : 0;
  }

  getAgeGroupLabel(ageGroup: string): string {
    const ageGroupLabels: { [key: string]: string } = {
      'COPII': 'Copii (0-12 ani)',
      'ADOLESCENTI': 'Adolescenți (13-17 ani)', 
      'ADULTI': 'Adulți (18-64 ani)',
      'SENIORI': 'Seniori (65+ ani)',
      'MIXT': 'Grup mixt'
    };
    return ageGroupLabels[ageGroup] || ageGroup;
  }

  loadEventStatistics() {
    // Încărcăm evenimentele
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe({
      next: (events) => {
        this.totalEvents = events.length;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Evenimente viitoare
        this.upcomingEvents = events.filter(event => {
          const startDate = new Date(event.startDate);
          return startDate > now;
        }).length;

        // Evenimente în luna curentă
        this.eventsThisMonth = events.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        }).length;

        // Calculăm locurile disponibile pentru evenimente viitoare
        const upcomingEventsForSpots = events.filter(event => {
          const startDate = new Date(event.startDate);
          return startDate > now;
        });
        
        this.availableSpots = upcomingEventsForSpots.length * 70; // 70 locuri per eveniment
        
        // Calculăm participanții pentru evenimente trecute și curente
        this.calculateTotalParticipants(events.filter(event => {
          const startDate = new Date(event.startDate);
          return startDate <= now;
        }));

      },
      error: (err) => {
        // Error handling for loading events can be implemented here
      }
    });
  }

  calculateTotalParticipants(pastEvents: any[]) {
    // Pentru fiecare eveniment trecut, încercăm să obținem numărul de participanți
    let totalCalculated = 0;
    let eventsProcessed = 0;
    
    if (pastEvents.length === 0) {
      this.totalParticipants = 0;
      return;
    }

    pastEvents.forEach(event => {
      this.http.get<any>(`http://localhost:8080/api/participants/count/${event.id}`).subscribe({
        next: (response) => {
          totalCalculated += response.count || 0;
          eventsProcessed++;
          if (eventsProcessed === pastEvents.length) {
            this.totalParticipants = totalCalculated;
          }
        },
        error: () => {
          eventsProcessed++;
          if (eventsProcessed === pastEvents.length) {
            this.totalParticipants = totalCalculated;
          }
        }
      });
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'NECONFIRMATA': return 'Neconfirmată';
      case 'CONFIRMATA': return 'Confirmată';
      case 'RESPINSA': return 'Respinsă';
      case 'PENDING': return 'În așteptare';
      case 'CONFIRMED': return 'Confirmată';
      case 'CANCELLED': return 'Anulată';
      default: return status || 'Necunoscut';
    }
  }
}
