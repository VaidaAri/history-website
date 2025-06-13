import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

@Component({
  selector: 'app-confirm-reservation',
  standalone: true,
  imports: [CommonModule, MeniuComponent, CadranComponent],
  templateUrl: './confirm-reservation.component.html',
  styleUrls: ['./confirm-reservation.component.css']
})
export class ConfirmReservationComponent implements OnInit {
  
  isLoading = true;
  confirmationStatus: 'success' | 'error' | 'loading' = 'loading';
  message = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.confirmationStatus = 'error';
      this.message = 'Token de confirmare lipsă.';
      this.isLoading = false;
      return;
    }

    this.confirmReservation();
  }

  confirmReservation() {
    this.http.post<any>(`http://localhost:8080/api/bookings/confirm/${this.token}`, {})
      .subscribe({
        next: (response) => {
          this.confirmationStatus = 'success';
          this.message = response.message || 'Rezervarea a fost confirmată cu succes!';
          this.isLoading = false;
          

          setTimeout(() => {
            this.router.navigate(['/rezervari']);
          }, 5000);
        },
        error: (err) => {
          this.confirmationStatus = 'error';
          this.message = err.error?.message || 'Token invalid sau expirat.';
          this.isLoading = false;
        }
      });
  }

  goToReservations() {
    this.router.navigate(['/rezervari']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}