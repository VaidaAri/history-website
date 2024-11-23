import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
@Component({
  selector: 'app-istoric',
  standalone: true,
  imports: [RouterModule, MeniuComponent],
  templateUrl: './istoric.component.html',
  styleUrl: './istoric.component.css'
})
export class IstoricComponent {

}
