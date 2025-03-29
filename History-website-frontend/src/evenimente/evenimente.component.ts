import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CadranComponent } from "../cadran/cadran.component";
@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CalendarComponent, CadranComponent],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css'
})
export class EvenimenteComponent {

}
