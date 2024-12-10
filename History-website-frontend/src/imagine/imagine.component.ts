import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imagine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagine.component.html',
  styleUrl: './imagine.component.css'
})
export class ImagineComponent implements OnInit{

  images: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchImages();
}

fetchImages() {
  this.http.get<any[]>('http://localhost:8080/api/images').subscribe({
    next: (data) => {
      this.images = data;
      console.log('Images fetched:', this.images);
    },
    error: (err) => {
      console.error('Error fetching images:', err);
    }
  });
}
}