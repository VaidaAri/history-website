import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rezervari',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CommonModule, FormsModule],
  templateUrl: './rezervari.component.html',
  styleUrls: ['./rezervari.component.css']
})
export class RezervariComponent {

  bookings: any = [];

  newBooking = {
    datetime: '',
    numberOfPersons: 0,
    guideRequired: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get("http://localhost:8080/api/bookings").subscribe((data) => {
      this.bookings = data;
    });
  }

  addBooking() { 
    this.http.post("http://localhost:8080/api/bookings", this.newBooking).subscribe({
      next: (response) => {
        alert("Booking added successfully!");
     console.log("New booking data: ", this.newBooking);
        this.fetchBookings(); 
      },
      error: (err) => {
        console.error("Error adding booking:", err);
        alert("Failed to add booking. Please try again.");
      }
    });
  }

  deleteBooking(bookingId: number) {
    if (confirm("Are you sure you want to delete this booking?")) {
      this.http.delete(`http://localhost:8080/api/bookings/${bookingId}`).subscribe({
        next: (response) => {
          alert("Booking deleted successfully!");
          this.fetchBookings();
        },
        error: (err) => {
          console.error("Error deleting booking:", err);
          alert("Failed to delete booking. Please try again.");
        }
      });
    }
  }
}
