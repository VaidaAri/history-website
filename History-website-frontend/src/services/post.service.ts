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

    // Processing images for upload
    
    try {
      const imageUploads: Observable<ImageUploadResponse>[] = postData.images.map((imageObj: any, index: number) => {
        if (!imageObj.file) {
          return of({ imagePath: '', error: 'Fișier lipsă' });
        }
        
        // Uploading image file
        
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        formData.append('position', index.toString());
        
        return this.http.post<ImageUploadResponse>(this.imageUploadUrl, formData);
      });

      return forkJoin<ImageUploadResponse[]>(imageUploads).pipe(
        switchMap((responses: ImageUploadResponse[]) => {
          // Processing upload responses
          
          const validResponses = responses.filter(resp => resp && resp.imagePath);
          
          const imageReferences = validResponses.map(response => {
            return { 
              path: response.imagePath,
              description: 'Imagine pentru postare'
            };
          });

          // Creating image references for post

          const newPost = {
            description: postData.description,
            images: imageReferences
          };

          return this.http.post<any>(this.apiUrl, newPost);
        })
      );
    } catch (error) {
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
      const existingImagesCount = postData.existingImages ? postData.existingImages.length : 0;
      const imageUploads: Observable<ImageUploadResponse>[] = newImages.map((imageObj: any, index: number) => {
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        formData.append('position', (existingImagesCount + index).toString());
        
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
      throw error;
    }
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}