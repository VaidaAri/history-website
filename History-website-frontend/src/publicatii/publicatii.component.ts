import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PublicationImage {
  url: string;
  folder: string;
  filename: string;
  index: number;
}

@Component({
  selector: 'app-publicatii',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, CommonModule],
  templateUrl: './publicatii.component.html',
  styleUrl: './publicatii.component.css'
})
export class PublicatiiComponent implements OnInit {
  arhivaSomesanaImages: PublicationImage[] = [];
  scanCopertiImages: PublicationImage[] = [];
  selectedCategory: string = 'arhivaSomesana';
  apiBaseUrl = 'http://localhost:8080/api/staticresources';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadArhivaSomesanaImages();
    this.loadScanCopertiImages();
  }
  
  loadArhivaSomesanaImages() {
    // Imaginile sunt de la img100.jpg până la img178.jpg
    const folderName = 'Coperti Arhiva Somesana';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 100; i <= 178; i++) {
      const filename = `img${i}.jpg`;
      const encodedFilename = encodeURIComponent(filename);
      this.arhivaSomesanaImages.push({
        url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedFilename}`,
        folder: folderName,
        filename: filename,
        index: i - 100
      });
    }
    // Adăugăm și coperta
    const copertaFilename = 'coperta arhiva somesana 2023-0.jpg';
    const encodedCopertaFilename = encodeURIComponent(copertaFilename);
    this.arhivaSomesanaImages.unshift({
      url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedCopertaFilename}`,
      folder: folderName,
      filename: copertaFilename,
      index: -1
    });
  }
  
  loadScanCopertiImages() {
    // Imaginile sunt de la scan001.jpg până la scan023.jpg
    const folderName = 'Scan coperti';
    const encodedFolder = encodeURIComponent(folderName);
    
    for (let i = 1; i <= 23; i++) {
      const filename = `scan${i.toString().padStart(3, '0')}.jpg`;
      const encodedFilename = encodeURIComponent(filename);
      this.scanCopertiImages.push({
        url: `${this.apiBaseUrl}/images/${encodedFolder}/${encodedFilename}`,
        folder: folderName,
        filename: filename,
        index: i - 1
      });
    }
  }
  
  switchCategory(category: string) {
    this.selectedCategory = category;
  }
}
