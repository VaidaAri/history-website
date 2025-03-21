import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
@Component({
  selector: 'app-evenimente',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CalendarComponent],
  templateUrl: './evenimente.component.html',
  styleUrl: './evenimente.component.css'
})
export class EvenimenteComponent {

}
