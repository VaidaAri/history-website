import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creeare-cont',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './creeare-cont.component.html',
  styleUrls: ['./creeare-cont.component.css'],
})
export class CreeareContComponent {
  admins: any = [];

  newAdmin = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.http.get("http://localhost:8080/api/administrators").subscribe((data) => {
      this.admins = data;
    });
  }

  registerAdmin() {
    this.http.post("http://localhost:8080/api/administrators", this.newAdmin).subscribe({
      next: () => {
        alert("Administrator adăugat cu succes!");
        this.fetchAdmins();  
        this.newAdmin = { firstName: '', lastName: '', username: '', password: '' }; // Resetează formularul
      },
      error: (err) => {
        console.error("Eroare la adăugarea administratorului:", err);
        alert("Eroare la adăugare. Încearcă din nou.");
      }
    });
  }

  deleteAdmin(adminId: number) {
    if (confirm("Sigur vrei să ștergi acest administrator?")) {
      this.http.delete(`http://localhost:8080/api/administrators/${adminId}`).subscribe({
        next: () => {
          alert("Administrator șters cu succes!");
          this.fetchAdmins();
        },
        error: (err) => {
          console.error("Eroare la ștergere:", err);
          alert("Eroare la ștergere. Încearcă din nou.");
        }
      });
    }
  }
}
