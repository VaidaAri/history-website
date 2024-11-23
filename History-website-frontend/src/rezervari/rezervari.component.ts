import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
@Component({
  selector: 'app-rezervari',
  standalone: true,
  imports: [RouterModule, MeniuComponent],
  templateUrl: './rezervari.component.html',
  styleUrl: './rezervari.component.css'
})
export class RezervariComponent {

}
