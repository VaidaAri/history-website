import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/bookings';
  private publicApiUrl = 'http://localhost:8080/api/bookings';
  
  private reservationCreatedSubject = new Subject<void>();
  private reservationUpdatedSubject = new Subject<void>();
  private reservationDeletedSubject = new Subject<void>();
  
  public reservationCreated$ = this.reservationCreatedSubject.asObservable();
  public reservationUpdated$ = this.reservationUpdatedSubject.asObservable();
  public reservationDeleted$ = this.reservationDeletedSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPendingReservationsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pending-count`);
  }


  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.reservationDeletedSubject.next();
      })
    );
  }

  createReservation(reservation: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skip-Interceptor': 'true'
    });
    
    return this.http.post<any>(this.publicApiUrl, reservation, { headers }).pipe(
      tap(() => {
        this.reservationCreatedSubject.next();
      })
    );
  }

  updateReservation(reservation: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, reservation);
  }

}