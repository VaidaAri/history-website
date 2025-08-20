import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-imagine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imagine.component.html',
  styleUrl: './imagine.component.css'
})

export class ImagineComponent implements OnInit{
  images: any[] = []; 
  selectedFile: File | null = null;
  description: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchImages();
}

fetchImages() {
  this.http.get<any[]>('http://localhost:8080/api/images').subscribe({
    next: (data) => {
      this.images = data;
    },
    error: (err) => {
      // Error handling for fetching images can be implemented here
    }
  });
}

onFileChange(event: any): void {
  this.selectedFile = event.target.files[0];
}

uploadImage() {
  if (this.selectedFile && this.description) {
    const formData = new FormData();
    formData.append('image', this.selectedFile); 
    formData.append('description', this.description); 
    this.uploadFileToStaticDirectory(formData);
  }
}

uploadFileToStaticDirectory(formData: FormData) {
  const uploadUrl = 'http://localhost:8080/api/images/upload-image';
  this.http.post(uploadUrl, formData).subscribe({
    next: (response: any) => {
      const imagePath = response.imagePath;
          this.fetchImages(); 
        },
        error: (err) => {
          // Error handling for image upload can be implemented here
        }
      });
  }
}