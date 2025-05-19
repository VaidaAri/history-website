import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from "../cadran/cadran.component";
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

@Component({
  selector: 'app-istoric',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CadranComponent, TranslatePipe],
  templateUrl: './istoric.component.html',
  styleUrl: './istoric.component.css',
  providers: [TranslationService] // Furnizăm serviciul la nivel de componentă
})
export class IstoricComponent {
  constructor(private translationService: TranslationService) {
    // Serviciul este injectat pentru a fi disponibil în template
  }
}
