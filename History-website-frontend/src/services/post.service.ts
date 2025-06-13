import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, of } from 'rxjs';

interface ImageUploadResponse {
  imagePath: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';
  private imageUploadUrl = 'http://localhost:8080/api/images/upload-image';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addPost(postData: any): Observable<any> {
    if (!postData.images || postData.images.length === 0) {
      const newPost = {
        description: postData.description,
        images: [] 
      };
      return this.http.post<any>(this.apiUrl, newPost);
    }

    console.log('Încărcăm imagini:', postData.images.length);
    
    try {
      const imageUploads: Observable<ImageUploadResponse>[] = postData.images.map((imageObj: any) => {
        if (!imageObj.file) {
          console.error('Lipsește fișierul pentru imagine:', imageObj);
          return of({ imagePath: '', error: 'Fișier lipsă' });
        }
        
        console.log('Încărcare imagine:', imageObj.file.name);
        
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        
        return this.http.post<ImageUploadResponse>(this.imageUploadUrl, formData);
      });

      return forkJoin<ImageUploadResponse[]>(imageUploads).pipe(
        switchMap((responses: ImageUploadResponse[]) => {
          console.log('Răspunsuri încărcare imagini:', responses);
          
          const validResponses = responses.filter(resp => resp && resp.imagePath);
          
          const imageReferences = validResponses.map(response => {
            return { 
              path: response.imagePath,
              description: 'Imagine pentru postare'
            };
          });

          console.log('Referințe imagini pentru postare:', imageReferences);

          const newPost = {
            description: postData.description,
            images: imageReferences
          };

          return this.http.post<any>(this.apiUrl, newPost);
        })
      );
    } catch (error) {
      console.error('Eroare în procesul de încărcare a imaginilor:', error);
      throw error;
    }
  }

  updatePost(postId: number, postData: any): Observable<any> {
    const newImages = postData.images.filter((img: any) => img.file);
    
    if (newImages.length === 0) {
      const updatedPost = {
        id: postId,
        description: postData.description,
        createdAt: postData.createdAt,
        images: postData.existingImages || [] 
      };
      return this.http.put<any>(this.apiUrl, updatedPost);
    }
    
    try {
      const imageUploads: Observable<ImageUploadResponse>[] = newImages.map((imageObj: any) => {
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        
        return this.http.post<ImageUploadResponse>(this.imageUploadUrl, formData);
      });
      
      if (imageUploads.length === 0) {
        const updatedPost = {
          id: postId,
          description: postData.description,
          createdAt: postData.createdAt, 
          images: postData.existingImages || [] 
        };
        return this.http.put<any>(this.apiUrl, updatedPost);
      }
      
      return forkJoin<ImageUploadResponse[]>(imageUploads).pipe(
        switchMap((responses: ImageUploadResponse[]) => {
          const validResponses = responses.filter(resp => resp && resp.imagePath);
          
          const newImageReferences = validResponses.map(response => {
            return { 
              path: response.imagePath,
              description: 'Imagine pentru postare'
            };
          });
          
          const allImages = [...(postData.existingImages || []), ...newImageReferences];
          
          const updatedPost = {
            id: postId,
            description: postData.description,
            createdAt: postData.createdAt,
            images: allImages
          };
          
          return this.http.put<any>(this.apiUrl, updatedPost);
        })
      );
    } catch (error) {
      console.error('Eroare în procesul de actualizare a postării:', error);
      throw error;
    }
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}