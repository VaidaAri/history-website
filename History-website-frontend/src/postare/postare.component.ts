import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postare.component.html',
  styleUrl: './postare.component.css'
})
export class PostareComponent implements OnInit {
  @Input() post: any;
  currentImageIndex: number = 0;
  
  ngOnInit() {
    this.currentImageIndex = 0;
  }
  
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:8080/api/images/uploads/${imagePath}`;
  }
  
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
  
  nextImage() {
    if (this.post.images && this.currentImageIndex < this.post.images.length - 1) {
      this.currentImageIndex++;
    }
  }
  
  goToImage(index: number) {
    if (this.post.images && index >= 0 && index < this.post.images.length) {
      this.currentImageIndex = index;
    }
  }
  
  openFullImage(image: any) {
    const url = this.getImageUrl(image.path);
    window.open(url, '_blank');
  }
}
