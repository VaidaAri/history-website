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
  pendingReservations: number = 0;
  confirmedReservations: number = 0;
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
    // Încărcăm rezervările
    this.http.get<any[]>('http://localhost:8080/api/reservations').subscribe({
      next: (reservations) => {
        this.totalReservations = reservations.length;
        this.totalVisitors = reservations.reduce((sum, res) => sum + (res.numberOfPersons || 0), 0);
        this.pendingReservations = reservations.filter(res => res.status === 'PENDING').length;
        this.confirmedReservations = reservations.filter(res => res.status === 'CONFIRMED').length;
        
        // Ultimele 5 rezervări
        this.recentReservations = reservations
          .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
          .slice(0, 5)
          .map(res => ({
            name: res.name,
            numberOfPersons: res.numberOfPersons,
            date: this.formatDate(res.date),
            status: this.getStatusLabel(res.status)
          }));
      },
      error: (err) => {
        console.error('Eroare la încărcarea statisticilor vizite:', err);
      }
    });
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

    // Încărcăm participanții
    this.http.get<any[]>('http://localhost:8080/api/participants').subscribe({
      next: (participants) => {
        this.totalParticipants = participants.length;
      },
      error: (err) => {
        console.error('Eroare la încărcarea participanților:', err);
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'În așteptare';
      case 'CONFIRMED': return 'Confirmată';
      case 'CANCELLED': return 'Anulată';
      default: return status || 'Necunoscut';
    }
  }
}
