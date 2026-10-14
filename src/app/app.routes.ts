import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Ahora | Rastro',
    loadComponent: () => import('./pages/now-page/now-page.component').then((module) => module.NowPageComponent),
  },
  {
    path: 'ruta',
    title: 'Ruta 1-60 | Rastro',
    loadComponent: () => import('./pages/route-page/route-page.component').then((module) => module.RoutePageComponent),
  },
  {
    path: 'talentos',
    title: 'Talentos | Rastro',
    loadComponent: () =>
      import('./pages/talents-page/talents-page.component').then((module) => module.TalentsPageComponent),
  },
  {
    path: 'mascotas',
    title: 'Mascotas | Rastro',
    loadComponent: () => import('./pages/pets-page/pets-page.component').then((module) => module.PetsPageComponent),
  },
  {
    path: 'equipo',
    title: 'Equipo | Rastro',
    loadComponent: () => import('./pages/gear-page/gear-page.component').then((module) => module.GearPageComponent),
  },
  {
    path: 'addons',
    title: 'Addons | Rastro',
    loadComponent: () => import('./pages/addons-page/addons-page.component').then((module) => module.AddonsPageComponent),
  },
  {
    path: 'personaje',
    title: 'Mi personaje | Rastro',
    loadComponent: () =>
      import('./pages/character-page/character-page.component').then((module) => module.CharacterPageComponent),
  },
  { path: '**', redirectTo: '' },
];
