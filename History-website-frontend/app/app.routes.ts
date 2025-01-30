import { Routes } from '@angular/router';
import { IstoricComponent } from '../src/istoric/istoric.component';
import { AcasaComponent } from '../src/acasa/acasa.component';
import { MeniuComponent } from '../src/meniu/meniu.component';
import { RezervariComponent } from '../src/rezervari/rezervari.component';
import { TarifeComponent } from '../src/tarife/tarife.component';
import { EvenimenteComponent } from '../src/evenimente/evenimente.component';
import { AdministratorLoginComponent } from '../src/administrator-login/administrator-login.component';
import { PublicatiiComponent } from '../src/publicatii/publicatii.component';


export const routes: Routes = [{path:'', component: AcasaComponent},
    {path:'istoric', component: IstoricComponent },
    {path:'meniu', component: MeniuComponent},
    {path:'rezervari', component: RezervariComponent},
    {path:'tarife', component: TarifeComponent},
    {path:'evenimente', component: EvenimenteComponent},
    {path:'administrator-login', component: AdministratorLoginComponent},
    {path:'publicatii', component: PublicatiiComponent}
];
