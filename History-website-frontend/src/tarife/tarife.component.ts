import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeniuComponent } from '../meniu/meniu.component';
import { CadranComponent } from '../cadran/cadran.component';
import { TranslatePipe } from '../services/i18n/translate.pipe';
import { TranslationService } from '../services/i18n/translation.service';

@Component({
  selector: 'app-tarife',
  standalone: true,
  imports: [RouterModule, MeniuComponent, CadranComponent, TranslatePipe],
  templateUrl: './tarife.component.html',
  styleUrl: './tarife.component.css',
  providers: [TranslationService]
})
export class TarifeComponent {
  constructor(private translationService: TranslationService) {

  }
}
