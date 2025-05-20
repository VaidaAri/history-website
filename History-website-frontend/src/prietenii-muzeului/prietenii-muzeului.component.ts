import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

@Component({
  selector: 'app-prietenii-muzeului',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent],
  templateUrl: './prietenii-muzeului.component.html',
  styleUrl: './prietenii-muzeului.component.css'
})
export class PrieteniiMuzeuluiComponent {
  // Exemple de categorii de prieteni ai muzeului
  categorii = [
    {
      titlu: 'Instituții Partenere',
      descriere: 'Instituții academice și culturale care colaborează cu Muzeul Grăniceresc Năsăudean.'
    },
    {
      titlu: 'Donatori',
      descriere: 'Personalități și organizații care au contribuit la îmbogățirea colecțiilor muzeului.'
    },
    {
      titlu: 'Voluntari',
      descriere: 'Persoane care contribuie cu timp și competențe la buna desfășurare a activităților muzeului.'
    },
    {
      titlu: 'Cercetători',
      descriere: 'Specialiști care studiază și valorifică patrimoniul cultural și istoric al muzeului.'
    }
  ];
}