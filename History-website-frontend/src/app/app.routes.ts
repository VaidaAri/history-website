import { Routes } from '@angular/router';
import { IstoricComponent } from '../istoric/istoric.component';
import { AcasaComponent } from '../acasa/acasa.component';
import { MeniuComponent } from '../meniu/meniu.component';
import { RezervariComponent } from '../rezervari/rezervari.component';
import { TarifeComponent } from '../tarife/tarife.component';
import { EvenimenteComponent } from '../evenimente/evenimente.component';
import { ImagineComponent } from '../imagine/imagine.component';
import { AdministratorLoginComponent } from '../administrator-login/administrator-login.component';
import { PublicatiiComponent } from '../publicatii/publicatii.component';
import { CreeareContComponent } from '../creeare-cont/creeare-cont.component';

export const routes: Routes = [{path:'', component: AcasaComponent},
    {path:'istoric', component: IstoricComponent },
    {path:'meniu', component: MeniuComponent},
    {path:'rezervari', component: RezervariComponent},
    {path:'tarife', component: TarifeComponent},
    {path:'evenimente', component: EvenimenteComponent},
    {path:'imagine', component:ImagineComponent},
    {path:'administrator-login', component: AdministratorLoginComponent},
    {path:'publicatii', component: PublicatiiComponent},
    {path:'creeare-cont', component: CreeareContComponent}
];
