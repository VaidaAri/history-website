import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from "../cadran/cadran.component";
@Component({
  selector: 'app-istoric',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CadranComponent],
  templateUrl: './istoric.component.html',
  styleUrl: './istoric.component.css'
})
export class IstoricComponent {

}
