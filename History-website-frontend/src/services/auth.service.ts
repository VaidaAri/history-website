import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private adminNameSubject = new BehaviorSubject<string>('');
  public adminName$ = this.adminNameSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api/administrators';

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');
    
    if (token) {
      this.isAuthenticatedSubject.next(true);
      if (adminName) {
        this.adminNameSubject.next(adminName);
      }
      

    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }

    return this.http.get<boolean>(`${this.apiUrl}/validate-token`).pipe(
      tap(isValid => {
        this.isAuthenticatedSubject.next(isValid);
        if (!isValid) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminName');
          this.adminNameSubject.next('');
        }
      }),
      catchError((error) => {
        console.warn('Eroare la validarea token-ului:', error);
        return of(true);
      })
    );
  }

  isAuthenticatedLocally(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token && this.isAuthenticated();
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminName', credentials.username);
          this.adminNameSubject.next(credentials.username);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    this.isAuthenticatedSubject.next(false);
    this.adminNameSubject.next('');
    this.router.navigate(['/']);
  }
  
  getAdminName(): string {
    return this.adminNameSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}