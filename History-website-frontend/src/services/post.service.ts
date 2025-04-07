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

  // Obține toate postările
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obține o postare specifică după ID
  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Adaugă o postare nouă cu imagini
  addPost(postData: any): Observable<any> {
    // Verificăm dacă există imagini de încărcat
    if (!postData.images || postData.images.length === 0) {
      // Dacă nu există imagini, adăugăm direct postarea
      const newPost = {
        description: postData.description,
        images: []  // Fără imagini
      };
      return this.http.post<any>(this.apiUrl, newPost);
    }

    // Pentru debug - afișăm informații despre imagini
    console.log('Încărcăm imagini:', postData.images.length);
    
    try {
      // Pregătim promisiunile pentru încărcarea imaginilor
      const imageUploads: Observable<ImageUploadResponse>[] = postData.images.map((imageObj: any) => {
        // Verificăm dacă avem fișierul disponibil
        if (!imageObj.file) {
          console.error('Lipsește fișierul pentru imagine:', imageObj);
          return of({ imagePath: '', error: 'Fișier lipsă' });
        }
        
        console.log('Încărcare imagine:', imageObj.file.name);
        
        // Creăm un form data pentru upload
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        
        // Trimitem fiecare imagine la server
        return this.http.post<ImageUploadResponse>(this.imageUploadUrl, formData);
      });

      // Folosim forkJoin pentru a aștepta ca toate imaginile să fie încărcate
      return forkJoin<ImageUploadResponse[]>(imageUploads).pipe(
        switchMap((responses: ImageUploadResponse[]) => {
          console.log('Răspunsuri încărcare imagini:', responses);
          
          // Filtrăm răspunsurile valide și extragem referințele
          const validResponses = responses.filter(resp => resp && resp.imagePath);
          
          // Extragem referințele la imaginile încărcate
          const imageReferences = validResponses.map(response => {
            return { 
              path: response.imagePath,
              description: 'Imagine pentru postare'
            };
          });

          console.log('Referințe imagini pentru postare:', imageReferences);

          // Creăm postarea cu referințele la imaginile încărcate
          const newPost = {
            description: postData.description,
            images: imageReferences
          };

          // Trimitem postarea la server
          return this.http.post<any>(this.apiUrl, newPost);
        })
      );
    } catch (error) {
      console.error('Eroare în procesul de încărcare a imaginilor:', error);
      // Returnăm un Observable de eroare
      throw error;
    }
  }

  // Actualizează o postare existentă
  updatePost(postId: number, postData: any): Observable<any> {
    // Verificăm dacă există imagini noi de încărcat
    const newImages = postData.images.filter((img: any) => img.file);
    
    if (newImages.length === 0) {
      // Dacă nu există imagini noi, actualizăm direct postarea
      const updatedPost = {
        id: postId,
        description: postData.description,
        createdAt: postData.createdAt, // Păstrăm data originală
        images: postData.existingImages || [] // Imagini existente
      };
      return this.http.put<any>(this.apiUrl, updatedPost);
    }
    
    try {
      // Încărcăm noile imagini
      const imageUploads: Observable<ImageUploadResponse>[] = newImages.map((imageObj: any) => {
        // Creăm un form data pentru upload
        const formData = new FormData();
        formData.append('image', imageObj.file);
        formData.append('description', 'Imagine pentru postare');
        
        // Trimitem fiecare imagine la server
        return this.http.post<ImageUploadResponse>(this.imageUploadUrl, formData);
      });
      
      // Dacă nu există imagini noi, continuăm cu un array gol
      if (imageUploads.length === 0) {
        const updatedPost = {
          id: postId,
          description: postData.description,
          createdAt: postData.createdAt, // Păstrăm data originală
          images: postData.existingImages || [] // Doar imagini existente
        };
        return this.http.put<any>(this.apiUrl, updatedPost);
      }
      
      // Așteptăm încărcarea imaginilor noi
      return forkJoin<ImageUploadResponse[]>(imageUploads).pipe(
        switchMap((responses: ImageUploadResponse[]) => {
          // Filtrăm răspunsurile valide
          const validResponses = responses.filter(resp => resp && resp.imagePath);
          
          // Extragem referințele la imaginile încărcate
          const newImageReferences = validResponses.map(response => {
            return { 
              path: response.imagePath,
              description: 'Imagine pentru postare'
            };
          });
          
          // Combinăm imaginile existente cu cele noi
          const allImages = [...(postData.existingImages || []), ...newImageReferences];
          
          // Actualizăm postarea cu toate imaginile
          const updatedPost = {
            id: postId,
            description: postData.description,
            createdAt: postData.createdAt, // Păstrăm data originală
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

  // Șterge o postare
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}