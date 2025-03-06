import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  events: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.events, // Inițial nu avem date
    eventClick: this.handleEventClick.bind(this)
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }
  
  loadEvents() {
    this.http.get<any[]>('http://localhost:8080/api/events').subscribe(data => {
      this.events = data.map(event => ({
        title: event.name,
        start: event.startDate,
        end: event.endDate,
        color: 'blue'
      }));
      this.updateCalendar();
    });
  }

  updateCalendar() {
    this.calendarOptions = { ...this.calendarOptions, events: this.events };
  }

  handleEventClick(info: any) {
    alert('Eveniment selectat: ' + info.event.title);
  }

}
