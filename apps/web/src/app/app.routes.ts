import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./public/home/home.component').then((m) => m.HomeComponent),
        data: {
          title: 'Home',
          description: 'Nirajkumar Satani — full-stack developer. Projects, skills, and contact.',
          animation: 'home',
        },
      },
      {
        path: 'about',
        redirectTo: '',
      },
      {
        path: 'projects',
        redirectTo: '',
      },
      {
        path: 'skills',
        redirectTo: '',
      },
      {
        path: 'contact',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
