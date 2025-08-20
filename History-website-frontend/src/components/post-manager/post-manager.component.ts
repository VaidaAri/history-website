import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="post-manager">
      <h4>Adaugă o postare nouă</h4>
      
      <div class="post-form-container">
        <textarea [(ngModel)]="description" placeholder="Scrie o postare..." class="post-textarea"></textarea>
        
        <div class="file-upload-container">
          <label for="file-upload" class="file-upload-label">
            <span class="file-icon">📷</span>
            <span>Selectează imagini</span>
          </label>
          <input type="file" id="file-upload" (change)="onFileSelected($event)" accept="image/*" multiple class="file-input">
        </div>
        
        <div *ngIf="images.length > 0" class="selected-images">
          <h5>Imagini selectate ({{ images.length }}):</h5>
          <div class="image-previews">
            <div *ngFor="let image of images; let i = index" class="image-preview-container">
              <img [src]="image.url" alt="Preview" class="image-preview" />
              <button (click)="removeImage(i)" class="remove-image-btn" title="Elimină imaginea">×</button>
            </div>
          </div>
        </div>
        
        <button (click)="createPost()" [disabled]="!description.trim()" class="create-post-btn">Publică Postarea</button>
      </div>
    </div>
  `,
  styles: [`
    .post-manager {
      background-color: #F8F4E3;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(234, 209, 150, 0.5);
    }

    h4 {
      color: #5D4037;
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 1.3em;
      text-align: center;
    }

    .post-form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .post-textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #EAD196;
      border-radius: 8px;
      background-color: white;
      font-family: 'Merriweather', serif;
      resize: vertical;
      color: #3E2723;
    }

    .post-textarea:focus {
      outline: none;
      border-color: #7D5A50;
      box-shadow: 0 0 0 2px rgba(125, 90, 80, 0.2);
    }

    .file-upload-container {
      margin: 15px 0;
    }

    .file-upload-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: #EAD196;
      color: #5D4037;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-family: 'Merriweather', serif;
      font-size: 1em;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .file-upload-label:hover {
      background-color: #E6C587;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .file-icon {
      font-size: 1.3em;
    }

    .file-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .selected-images {
      margin-top: 10px;
    }

    .selected-images h5 {
      color: #5D4037;
      margin: 0 0 10px 0;
      font-size: 1em;
    }

    .image-previews {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .image-preview-container {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 22px;
      height: 22px;
      background-color: rgba(193, 73, 83, 0.8);
      color: white;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
    }

    .create-post-btn {
      background-color: #7D5A50;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-family: 'Merriweather', serif;
      font-size: 1em;
      width: 100%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .create-post-btn:hover {
      background-color: #5D4037;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .create-post-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .post-manager {
        padding: 15px;
      }
    }
  `]
})
export class PostManagerComponent implements OnInit {
  @Output() postCreated = new EventEmitter<void>();
  
  description: string = '';
  images: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.type.match(/image\/*/) == null) {
          alert('Doar fișierele de tip imagine sunt permise!');
          continue;
        }
        
        if (this.images.length >= 30) {
          alert('Poți adăuga maxim 30 de imagini la o postare.');
          break;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.images.push({
            url: reader.result as string,
            file: file
          });
        };
      }
    }
    
    event.target.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  createPost() {
    if (!this.description.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }

    const newPost = { 
      description: this.description, 
      images: this.images
    };

    const loadingMessage = 'Se încarcă postarea...';
    // Processing post creation

    this.postService.addPost(newPost).subscribe({
      next: () => {
        alert('Postare adăugată cu succes!');
        this.description = '';
        this.images = [];
        this.postCreated.emit();
      },
      error: (err) => {
        // Error handling for post creation can be implemented here
        alert('A apărut o eroare la crearea postării. Vă rugăm să încercați din nou.');
      }
    });
  }
}