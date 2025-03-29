import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { ImagineComponent } from '../imagine/imagine.component';
import { PostareComponent } from '../postare/postare.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadranComponent } from "../cadran/cadran.component";

@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [
    RouterModule,
    MeniuComponent,
    ImagineComponent,
    PostareComponent,
    CadranComponent,
    CommonModule,
    FormsModule,
    HttpClientModule // <-- Adăugat aici
    ,
    CadranComponent
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.images.push({ url: reader.result as string }); 
      };
      reader.readAsDataURL(file); 
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
