import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { ImagineComponent } from '../imagine/imagine.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { PostareComponent } from '../postare/postare.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [
    RouterModule, 
    MeniuComponent, 
    ImagineComponent, 
    CalendarComponent, 
    PostareComponent, 
    CommonModule, 
    FormsModule, 
    HttpClientModule // <-- Adăugat aici
  ],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent {
  posts: any[] = [];
  description: string = '';
  imageUrl: string = '';
  images: any[] = [];
  isAdmin: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isAdmin = !!localStorage.getItem('adminToken'); 
    this.loadPosts();
  }

  loadPosts() {
    this.http.get<any[]>('http://localhost:8080/api/posts').subscribe((data) => {
      this.posts = data;
    });
  }

  addImage() {
    if (this.imageUrl.trim()) {
      this.images.push({ url: this.imageUrl });
      this.imageUrl = ''; 
    }
  }

  createPost() {
    if (!this.description.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }

    const newPost = { description: this.description, images: this.images };

    this.http.post('http://localhost:8080/api/posts', newPost).subscribe(() => {
      alert('Postare adăugată cu succes!');
      this.description = '';
      this.images = [];
      this.loadPosts();
    });
  }
}
