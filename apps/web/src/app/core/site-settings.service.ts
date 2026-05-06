import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import type { SiteSettings } from '../shared/models';

const DEFAULT_SETTINGS: SiteSettings = {
  fullName: 'Nirajkumar Satani',
  headline: 'Full Stack Developer',
  taglineLines: ['Angular · Node · MongoDB', 'APIs, auth, and polished UI'],
  aboutSummary:
    'I build responsive web apps with Angular and Node, backed by MongoDB - from idea to production.',
  locationLabel: 'India',
  profilePhotoUrl: '/profile.png',
  logoUrl: '/logo.png',
  resumeUrl: '/resume.pdf',
  contactEmail: '',
  phone: '',
  timezone: 'Asia/Kolkata',
  socials: [],
  heroStats: [],
  seoTitle: 'Nirajkumar Satani · Full Stack Developer',
  seoDescription: 'Portfolio, projects, skills, and contact.',
  themeId: 'night',
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly refresh$ = new Subject<void>();

  readonly settings$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.http
        .get<SiteSettings>('/api/site-settings', {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
          params: { _ts: Date.now().toString() },
        })
        .pipe(catchError(() => of(DEFAULT_SETTINGS)))
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  refresh(): void {
    this.refresh$.next();
  }

  update(payload: SiteSettings) {
    return this.http.put<SiteSettings>('/api/site-settings', payload).pipe(tap(() => this.refresh()));
  }
}
