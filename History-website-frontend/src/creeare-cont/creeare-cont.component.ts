import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeniuComponent } from '../meniu/meniu.component';

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

  constructor(private http: HttpClient) {}

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
      next: () => {
        alert("Administrator adăugat cu succes!");
        this.newAdmin = { firstName: '', lastName: '', username: '', password: '', email: '' }; 
        this.passwordError = '';
      },
      error: (err) => {
        console.error("Eroare la adăugarea administratorului:", err);
        alert("Eroare la adăugare. Încearcă din nou.");
      }
    });
  }


}
