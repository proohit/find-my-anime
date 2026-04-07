import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./search/search').then((m) => m.Search),
  },
  {
    path: 'anime/:id',
    loadComponent: () => import('./anime-details/anime-details').then((m) => m.AnimeDetails),
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats').then((m) => m.Stats),
  },
];
