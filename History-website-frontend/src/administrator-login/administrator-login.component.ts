import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-administrator-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './administrator-login.component.html',
  styleUrls: ['./administrator-login.component.css'],
})
export class AdministratorLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Dacă utilizatorul este deja autentificat, redirecționează la pagina principală
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  login() {
    const credentials = { username: this.username, password: this.password };
  
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Autentificare eșuată! Verificați datele introduse.';
      }
    });
  }
}
