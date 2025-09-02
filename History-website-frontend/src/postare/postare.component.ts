import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../services/i18n/translate.pipe';

@Component({
  selector: 'app-postare',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './postare.component.html',
  styleUrl: './postare.component.css'
})
export class PostareComponent implements OnInit {
  @Input() post: any;
  currentImageIndex: number = 0;
  isExpanded: boolean = false;
  maxCharacters: number = 200;
  
  ngOnInit() {
    this.currentImageIndex = 0;
  }
  
  get shouldShowToggle(): boolean {
    return this.post?.description && this.post.description.length > this.maxCharacters;
  }
  
  get displayText(): string {
    if (!this.post?.description) return '';
    
    if (!this.shouldShowToggle || this.isExpanded) {
      return this.post.description;
    }
    
    return this.post.description.substring(0, this.maxCharacters) + '...';
  }
  
  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
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
    // Functionality removed - no automatic tab opening
  }
}
