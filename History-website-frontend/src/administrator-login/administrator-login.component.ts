import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-administrator-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './administrator-login.component.html',
  styleUrls: ['./administrator-login.component.css'],
})
export class AdministratorLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const credentials = { username: this.username, password: this.password };
  
    this.http.post('http://localhost:8080/api/administrators/login', credentials, { responseType: 'text' })
      .subscribe({
        next: (token) => {
          localStorage.setItem('adminToken', token); // Salvăm token-ul
          this.router.navigate(['/administrator']);
        },
        error: () => {
          this.errorMessage = 'Autentificare eșuată! Verificați datele introduse.';
        }
      });
  }
  
}
