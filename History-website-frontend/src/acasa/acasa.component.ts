import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [RouterModule, MeniuComponent],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent {

}
