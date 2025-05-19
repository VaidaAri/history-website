import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inițializăm cu false pentru a evita autentificarea automată
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // BehaviorSubject pentru numele administratorului
  private adminNameSubject = new BehaviorSubject<string>('');
  public adminName$ = this.adminNameSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api/administrators';

  constructor(private http: HttpClient, private router: Router) {
    // Verifică dacă există un token salvat
    const token = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');
    
    if (token) {
      this.isAuthenticatedSubject.next(true);
      if (adminName) {
        this.adminNameSubject.next(adminName);
      }
      
      // Validăm token-ul la inițializare pentru a verifica dacă este încă valid
      this.validateToken().subscribe();
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Verifică validitatea token-ului de la server
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }

    // În mod normal, am face un apel la API pentru a valida token-ul
    // Dacă nu există un endpoint pentru validare, putem folosi un endpoint existent
    // Acest apel ar trebui să folosească token-ul și să returneze true sau false
    return this.http.get<boolean>(`${this.apiUrl}/validate-token`).pipe(
      tap(isValid => {
        this.isAuthenticatedSubject.next(isValid);
        if (!isValid) {
          localStorage.removeItem('adminToken');
        }
      }),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        localStorage.removeItem('adminToken');
        return of(false);
      })
    );
  }

  // Autentificare administrator
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

  // Deconectare administrator
  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    this.isAuthenticatedSubject.next(false);
    this.adminNameSubject.next('');
    this.router.navigate(['/']); // Redirecționare către pagina principală
  }
  
  // Obține numele administratorului
  getAdminName(): string {
    return this.adminNameSubject.value;
  }

  // Obține starea curentă de autentificare
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Obține token-ul de autentificare
  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}