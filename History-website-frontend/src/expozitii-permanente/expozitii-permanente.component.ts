import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

@Component({
  selector: 'app-expozitii-permanente',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent],
  templateUrl: './expozitii-permanente.component.html',
  styleUrl: './expozitii-permanente.component.css'
})
export class ExpozitiiPermanenteComponent {
  // Exemple de expoziții permanente
  expozitii = [
    {
      titlu: 'Istoria Regimentului de Graniță',
      descriere: 'Expoziție dedicată istoriei Regimentului II Român de Graniță și impactului său asupra dezvoltării zonei Năsăudului.',
      imagine: 'http://localhost:8080/images/Catana neagra.jpg'
    },
    {
      titlu: 'Etnografie Locală',
      descriere: 'Prezentare a tradițiilor, costumelor și obiceiurilor specifice zonei Năsăudene.',
      imagine: ''
    },
    {
      titlu: 'Personalități Năsăudene',
      descriere: 'Expoziție dedicată personalităților marcante care au contribuit la dezvoltarea culturală și istorică a Năsăudului.',
      imagine: ''
    }
  ];
}