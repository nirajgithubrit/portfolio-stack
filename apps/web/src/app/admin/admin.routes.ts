import { Routes } from '@angular/router';
import { adminAuthGuard } from '../core/admin-auth.guard';
import { adminGuestGuard } from '../core/admin-guest.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
    canActivate: [adminGuestGuard],
    data: { title: 'Admin Login', description: 'Sign in to manage portfolio content.' },
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [adminAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { title: 'Dashboard' },
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/admin-projects.component').then((m) => m.AdminProjectsComponent),
        data: { title: 'Projects' },
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./skills/admin-skills.component').then((m) => m.AdminSkillsComponent),
        data: { title: 'Skills' },
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./experience/admin-experience.component').then((m) => m.AdminExperienceComponent),
        data: { title: 'Experience' },
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./messages/admin-messages.component').then((m) => m.AdminMessagesComponent),
        data: { title: 'Messages' },
      },
      {
        path: 'site-settings',
        loadComponent: () =>
          import('./site-settings/admin-site-settings.component').then(
            (m) => m.AdminSiteSettingsComponent
          ),
        data: { title: 'Site Settings' },
      },
    ],
  },
];
