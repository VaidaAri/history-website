import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeniuComponent } from '../meniu/meniu.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-creeare-cont',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MeniuComponent],
  templateUrl: './creeare-cont.component.html',
  styleUrls: ['./creeare-cont.component.css'],
})
export class CreeareContComponent {
  admins: any = [];
  showPassword: boolean = false;
  passwordError: string = '';

  newAdmin = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
  };

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  ngOnInit() {

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validatePassword() {
    if (this.newAdmin.password.length < 8) {
      this.passwordError = 'Parola trebuie să conțină minim 8 caractere';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  registerAdmin() {
    if (!this.validatePassword()) {
      return;
    }

    this.http.post("http://localhost:8080/api/administrators", this.newAdmin).subscribe({
      next: (response: any) => {
        const successMessage = response?.message || 'Administrator adăugat cu succes!';
        this.notificationService.showSuccess('Administrator înregistrat', successMessage);
        this.newAdmin = { firstName: '', lastName: '', username: '', password: '', email: '' }; 
        this.passwordError = '';
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Eroare la adăugare. Încearcă din nou.';
        this.notificationService.showError('Eroare înregistrare', errorMessage);
      }
    });
  }


}
