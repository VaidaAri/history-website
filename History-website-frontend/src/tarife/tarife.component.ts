import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';
@Component({
  selector: 'app-tarife',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CadranComponent],
  templateUrl: './tarife.component.html',
  styleUrl: './tarife.component.css'
})
export class TarifeComponent {

}
