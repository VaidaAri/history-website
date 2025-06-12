import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MeniuComponent } from '../../meniu/meniu.component';

@Component({
  selector: 'app-statistici-lunare',
  standalone: true,
  imports: [MeniuComponent, CommonModule, HttpClientModule],
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
  activeEvents: number = 0;
  totalParticipants: number = 0;
  upcomingEvents: number = 0;
  recentEvents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVisitStatistics();
    this.loadEventStatistics();
  }

  changeSection(section: string) {
    this.currentSection = section;
  }

  loadVisitStatistics() {
    console.log('🔄 Începem încărcarea statisticilor...');
    // Încărcăm rezervările
    this.http.get<any[]>('http://localhost:8080/api/bookings').subscribe({
      next: (reservations) => {
        console.log('✅ SUCCESS - Rezervări încărcate pentru statistici:', reservations);
        console.log('📊 Numărul total de rezervări confirmate:', reservations.length);
        console.log('ℹ️ NOTĂ: Afișăm doar rezervările confirmate, nu toate rezervările');
        
        this.totalReservations = reservations.length;
        this.totalVisitors = reservations.reduce((sum, res) => sum + (res.numberOfPersons || 0), 0);
        
        console.log('👥 Total vizitatori calculat:', this.totalVisitors);
        
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
          
        console.log('📝 Rezervări recente procesate:', this.recentReservations);
      },
      error: (err) => {
        console.error('❌ EROARE la încărcarea statisticilor vizite:', err);
        console.error('📍 Status error:', err.status);
        console.error('📍 URL încercat:', 'http://localhost:8080/api/bookings/all');
        
        if (err.status === 0) {
          console.error('🔌 Backend-ul nu răspunde! Verifică dacă rulează pe port 8080');
        } else if (err.status === 404) {
          console.error('🔍 Endpoint-ul nu există! Verifică /api/bookings/all');
        }
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
        this.activeEvents = events.filter(event => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          return startDate <= now && endDate >= now;
        }).length;

        this.upcomingEvents = events.filter(event => {
          const startDate = new Date(event.startDate);
          return startDate > now;
        }).length;

        // Ultimele 5 evenimente
        this.recentEvents = events
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          .slice(0, 5)
          .map(event => ({
            title: event.title,
            startDate: this.formatDate(event.startDate),
            endDate: this.formatDate(event.endDate),
            location: event.location
          }));
      },
      error: (err) => {
        console.error('Eroare la încărcarea statisticilor evenimente:', err);
      }
    });

    // Pentru participanți, îi calculăm pe baza evenimentelor
    // Nu există un endpoint general /api/participants, doar pe evenimente specifice
    this.totalParticipants = 0; // Va fi calculat când se încarcă evenimentele
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
