import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface MuseumSchedule {
  id: number;
  seasonName: string;
  weekdaysOpen: string;
  weekdaysClose: string;
  weekendOpen: string;
  weekendClose: string;
  specialNotes: string;
  isActive: boolean;
  validMonths: number[];
}

@Injectable({
  providedIn: 'root'
})
export class MuseumScheduleService {
  private apiUrl = 'http://localhost:8080/api/museum-schedule';
  
  private fallbackSchedules: MuseumSchedule[] = [
    {
      id: 1,
      seasonName: 'Vară',
      weekdaysOpen: '09:00',
      weekdaysClose: '18:00',
      weekendOpen: '10:00',
      weekendClose: '16:00',
      specialNotes: 'Muzeul este ÎNCHIS LUNEA pentru activități administrative.',
      isActive: true,
      validMonths: [3, 4, 5, 6, 7, 8, 9]
    },
    {
      id: 2,
      seasonName: 'Iarnă',
      weekdaysOpen: '10:00',
      weekdaysClose: '17:00',
      weekendOpen: '10:00',
      weekendClose: '15:00',
      specialNotes: 'Muzeul este ÎNCHIS LUNEA pentru activități administrative. Închis în zilele de 25, 26 decembrie și 1, 2 ianuarie.',
      isActive: true,
      validMonths: [0, 1, 2, 10, 11] 
    }
  ];

  constructor(private http: HttpClient) { }

  getCurrentSchedule(): Observable<MuseumSchedule> {
    return this.http.get<MuseumSchedule>(`${this.apiUrl}/current`).pipe(
      catchError(() => {
        const currentMonth = new Date().getMonth();
        const schedule = this.fallbackSchedules.find(s => 
          s.validMonths.includes(currentMonth)
        );
        
        return of(schedule || this.fallbackSchedules[0]);
      })
    );
  }

  getAllSchedules(): Observable<MuseumSchedule[]> {
    return this.http.get<MuseumSchedule[]>(this.apiUrl).pipe(
      catchError(() => of(this.fallbackSchedules))
    );
  }

  updateSchedule(schedule: MuseumSchedule): Observable<MuseumSchedule> {
    return this.http.put<MuseumSchedule>(`${this.apiUrl}/${schedule.id}`, schedule);
  }
}