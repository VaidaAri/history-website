import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postare.component.html',
  styleUrl: './postare.component.css'
})
export class PostareComponent {
  @Input() post: any;
}
