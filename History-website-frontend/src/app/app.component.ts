import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'History-website-frontend';
}
