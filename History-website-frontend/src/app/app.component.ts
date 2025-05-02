import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from "../meniu/meniu.component";
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'History-website-frontend';
  isAdmin = false;
  adminName = '';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
    
    this.authService.adminName$.subscribe(name => {
      this.adminName = name;
    });
  }
  
  logout() {
    this.authService.logout();
  }
}
