import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CadranComponent } from "../cadran/cadran.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [CommonModule, RouterModule, MeniuComponent, CalendarComponent, CadranComponent],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css'
})
export class EvenimenteComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verificăm dacă utilizatorul este administrator
    this.isAdmin = this.authService.isAuthenticated();
    
    // Abonăm pentru a detecta schimbări în starea de autentificare
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
  }

  // Metoda pentru deconectare
  logout() {
    this.authService.logout();
  }

  // Metoda pentru redirecționare către pagina de autentificare
  goToLogin() {
    this.router.navigate(['/administrator-login']);
  }
}
