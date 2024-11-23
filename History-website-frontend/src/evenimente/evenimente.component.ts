import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";

@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [RouterModule, MeniuComponent],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css'
})
export class EvenimenteComponent {

}
