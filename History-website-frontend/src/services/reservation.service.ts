import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/bookings';
  
  // Subjects pentru notificarea schimbărilor de rezervări
  private reservationCreatedSubject = new Subject<void>();
  private reservationUpdatedSubject = new Subject<void>();
  private reservationDeletedSubject = new Subject<void>();
  
  // Observables publice la care componentele se pot abona
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

  approveReservation(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/approve`, {}).pipe(
      tap(() => {
        // Notifică componentele că o rezervare a fost actualizată
        this.reservationUpdatedSubject.next();
      })
    );
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Notifică componentele că o rezervare a fost ștearsă
        this.reservationDeletedSubject.next();
      })
    );
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation).pipe(
      tap(() => {
        // Emite evenimentul pentru a notifica toate componentele abonate
        this.reservationCreatedSubject.next();
      })
    );
  }

  updateReservation(reservation: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, reservation);
  }
}