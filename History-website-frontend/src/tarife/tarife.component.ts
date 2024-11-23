import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
@Component({
  selector: 'app-tarife',
  standalone: true,
  imports: [RouterModule, MeniuComponent],
  templateUrl: './tarife.component.html',
  styleUrl: './tarife.component.css'
})
export class TarifeComponent {

}
