import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';

@Component({
  selector: 'app-peisaje-muzeu',
  standalone: true,
  imports: [RouterModule, CommonModule, MeniuComponent, CadranComponent],
  templateUrl: './peisaje-muzeu.component.html',
  styleUrl: './peisaje-muzeu.component.css'
})
export class PeisajeMuzeuComponent {
  // Array cu imagini din curtea muzeului
  peisajeImages = [];
}