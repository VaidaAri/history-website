import { Routes } from '@angular/router';
import { AcasaComponent } from '../acasa/acasa.component';

export const routes: Routes = [
    {path:'', component: AcasaComponent},
    {path:'istoric', loadComponent: () => import('../istoric/istoric.component').then(m => m.IstoricComponent)},
    {path:'meniu', loadComponent: () => import('../meniu/meniu.component').then(m => m.MeniuComponent)},
    {path:'rezervari', loadComponent: () => import('../rezervari/rezervari.component').then(m => m.RezervariComponent)},
    {path:'tarife', loadComponent: () => import('../tarife/tarife.component').then(m => m.TarifeComponent)},
    {path:'evenimente', loadComponent: () => import('../evenimente/evenimente.component').then(m => m.EvenimenteComponent)},
    {path:'imagine', loadComponent: () => import('../imagine/imagine.component').then(m => m.ImagineComponent)},
    {path:'administrator-login', loadComponent: () => import('../administrator-login/administrator-login.component').then(m => m.AdministratorLoginComponent)},
    {path:'publicatii', loadComponent: () => import('../publicatii/publicatii.component').then(m => m.PublicatiiComponent)},
    {path:'creeare-cont', loadComponent: () => import('../creeare-cont/creeare-cont.component').then(m => m.CreeareContComponent)},
    {path: 'administrator', loadComponent: () => import('../administrator/administrator.component').then(m => m.AdministratorComponent)},
    {path: 'cadran', loadComponent: () => import('../cadran/cadran.component').then(m => m.CadranComponent)},
    {path: 'peisaje-muzeu', loadComponent: () => import('../peisaje-muzeu/peisaje-muzeu.component').then(m => m.PeisajeMuzeuComponent)},
    {path: 'expozitii-permanente', loadComponent: () => import('../expozitii-permanente/expozitii-permanente.component').then(m => m.ExpozitiiPermanenteComponent)},
    {path: 'prietenii-muzeului', loadComponent: () => import('../prietenii-muzeului/prietenii-muzeului.component').then(m => m.PrieteniiMuzeuluiComponent)},
    {path: 'confirm-reservation/:token', loadComponent: () => import('../confirm-reservation/confirm-reservation.component').then(m => m.ConfirmReservationComponent)},
    {path: 'statistici', loadComponent: () => import('./statistici-lunare/statistici-lunare.component').then(m => m.StatisticiLunareComponent)},
];
