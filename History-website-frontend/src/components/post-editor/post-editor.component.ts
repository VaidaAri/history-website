import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="post-editor">
      <h4>Editează postarea</h4>
      
      <div class="post-form-container">
        <textarea [(ngModel)]="description" placeholder="Editează textul postării..." class="post-textarea"></textarea>
        
        <div *ngIf="existingImages.length > 0" class="existing-images">
          <h5>Imagini existente ({{ existingImages.length }}):</h5>
          <div class="image-previews">
            <div *ngFor="let image of existingImages; let i = index" class="image-preview-container">
              <img [src]="getImageUrl(image.path)" alt="Imagine existentă" class="image-preview" />
              <button (click)="removeExistingImage(i)" class="remove-image-btn" title="Elimină imaginea">×</button>
            </div>
          </div>
        </div>
        
        <div class="file-upload-container">
          <label for="edit-file-upload" class="file-upload-label">
            <span class="file-icon">📷</span>
            <span>Adaugă imagini noi</span>
          </label>
          <input type="file" id="edit-file-upload" (change)="onFileSelected($event)" accept="image/*" multiple class="file-input">
        </div>
        
        <div *ngIf="newImages.length > 0" class="selected-images">
          <h5>Imagini noi selectate ({{ newImages.length }}):</h5>
          <div class="image-previews">
            <div *ngFor="let image of newImages; let i = index" class="image-preview-container">
              <img [src]="image.url" alt="Preview" class="image-preview" />
              <button (click)="removeNewImage(i)" class="remove-image-btn" title="Elimină imaginea">×</button>
            </div>
          </div>
        </div>
        
        <div class="button-group">
          <button (click)="updatePost()" [disabled]="!description.trim()" class="update-post-btn">Salvează modificările</button>
          <button (click)="cancelEdit()" class="cancel-btn">Anulează</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-editor {
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

    .existing-images, .selected-images {
      margin-top: 10px;
    }

    .existing-images h5, .selected-images h5 {
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

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .update-post-btn {
      flex: 2;
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
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .update-post-btn:hover {
      background-color: #5D4037;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .update-post-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .cancel-btn {
      flex: 1;
      background-color: #C14953;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-family: 'Merriweather', serif;
      font-size: 1em;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .cancel-btn:hover {
      background-color: #A13842;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .post-editor {
        padding: 15px;
      }
      
      .button-group {
        flex-direction: column;
      }
    }
  `]
})
export class PostEditorComponent implements OnInit {
  @Input() postId: number = 0;
  @Output() editCancelled = new EventEmitter<void>();
  @Output() postUpdated = new EventEmitter<void>();
  
  description: string = '';
  existingImages: any[] = [];
  newImages: any[] = [];
  originalPost: any = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    if (this.postId) {
      this.loadPost();
    }
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.originalPost = post;
        this.description = post.description;
        this.existingImages = post.images || [];
      },
      error: (err) => {
        console.error('Eroare la încărcarea postării:', err);
        alert('A apărut o eroare la încărcarea postării pentru editare.');
        this.cancelEdit();
      }
    });
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

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.type.match(/image\/*/) == null) {
          alert('Doar fișierele de tip imagine sunt permise!');
          continue;
        }
        
        if (this.existingImages.length + this.newImages.length >= 5) {
          alert('Poți avea maxim 5 imagini la o postare.');
          break;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.newImages.push({
            url: reader.result as string,
            file: file
          });
        };
      }
    }
    
    event.target.value = '';
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
  }

  updatePost() {
    if (!this.description.trim()) {
      alert('Descrierea nu poate fi goală!');
      return;
    }

    const updatedPost = { 
      description: this.description,
      existingImages: this.existingImages,
      images: this.newImages, 
      createdAt: this.originalPost?.createdAt 
    };

    this.postService.updatePost(this.postId, updatedPost).subscribe({
      next: () => {
        alert('Postare actualizată cu succes!');
        this.postUpdated.emit();
      },
      error: (err) => {
        console.error('Eroare la actualizarea postării:', err);
        alert('A apărut o eroare la actualizarea postării. Vă rugăm să încercați din nou.');
      }
    });
  }

  cancelEdit() {
    this.editCancelled.emit();
  }
}