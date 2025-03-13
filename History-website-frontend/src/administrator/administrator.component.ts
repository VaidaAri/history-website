import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { PostareComponent } from '../postare/postare.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [CommonModule, FormsModule, PostareComponent, RouterModule],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.css'
})
export class AdministratorComponent implements OnInit {
  posts: any[] = [];
  description: string = '';
  imageUrl: string = '';
  images: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadPosts();
  }

  checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminToken'); 
    if (!isLoggedIn) {
      this.router.navigate(['/administrator-login']);
    }
  }

  loadPosts() {
    this.http.get<any[]>('http://localhost:8080/api/posts').subscribe(data => {
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

  deletePost(id: number) {
    if (confirm('Sigur vrei să ștergi această postare?')) {
      this.http.delete(`http://localhost:8080/api/posts/${id}`).subscribe(() => {
        alert('Postare ștearsă!');
        this.loadPosts();
      });
    }
  }

  logout() {
    localStorage.removeItem('adminToken'); 
    this.router.navigate(['/administrator-login']);
  }
}
