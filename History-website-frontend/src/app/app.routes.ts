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
import { AdministratorComponent } from '../administrator/administrator.component';
import { CadranComponent } from '../cadran/cadran.component';
import { PeisajeMuzeuComponent } from '../peisaje-muzeu/peisaje-muzeu.component';
import { ExpozitiiPermanenteComponent } from '../expozitii-permanente/expozitii-permanente.component';
import { PrieteniiMuzeuluiComponent } from '../prietenii-muzeului/prietenii-muzeului.component';
import { ConfirmReservationComponent } from '../confirm-reservation/confirm-reservation.component';
import { SmartCalendarComponent } from '../smart-calendar/smart-calendar.component';

export const routes: Routes = [{path:'', component: AcasaComponent},
    {path:'istoric', component: IstoricComponent },
    {path:'meniu', component: MeniuComponent},
    {path:'rezervari', component: RezervariComponent},
    {path:'tarife', component: TarifeComponent},
    {path:'evenimente', component: EvenimenteComponent},
    {path:'imagine', component:ImagineComponent},
    {path:'administrator-login', component: AdministratorLoginComponent},
    {path:'publicatii', component: PublicatiiComponent},
    {path:'creeare-cont', component: CreeareContComponent},
    {path: 'administrator', component: AdministratorComponent},
    {path: 'cadran', component: CadranComponent},
    {path: 'peisaje-muzeu', component: PeisajeMuzeuComponent},
    {path: 'expozitii-permanente', component: ExpozitiiPermanenteComponent},
    {path: 'prietenii-muzeului', component: PrieteniiMuzeuluiComponent},
    {path: 'confirm-reservation/:token', component: ConfirmReservationComponent},
    {path: 'smart-calendar', component: SmartCalendarComponent}
];
