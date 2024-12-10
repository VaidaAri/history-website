import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { ImagineComponent } from '../imagine/imagine.component';
@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [RouterModule, MeniuComponent, ImagineComponent],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent {

}
