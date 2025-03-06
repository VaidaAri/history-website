import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { ImagineComponent } from '../imagine/imagine.component';
import { CalendarComponent } from '../calendar/calendar.component'

@Component({
  selector: 'app-acasa',
  standalone: true,
  imports: [RouterModule, MeniuComponent, ImagineComponent, CalendarComponent],
  templateUrl: './acasa.component.html',
  styleUrl: './acasa.component.css'
})
export class AcasaComponent {

}
