import { computed, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, shareReplay } from 'rxjs';
import type { Experience, Project, Skill } from '../shared/models';

function careerYears(rows: Experience[]): number {
  if (!rows.length) return 0;
  const now = Date.now();
  let earliest = now;
  for (const r of rows) {
    const t = new Date(r.startDate).getTime();
    if (!Number.isNaN(t) && t < earliest) earliest = t;
  }
  return Math.max(0, Math.floor((now - earliest) / (365.25 * 24 * 60 * 60 * 1000)));
}

/** Loads the public lists once and shares them with every section. */
@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private readonly http = inject(HttpClient);

  private list<T>(url: string) {
    return this.http.get<T[]>(url).pipe(
      catchError(() => of([] as T[])),
      shareReplay(1)
    );
  }

  readonly projects = toSignal(this.list<Project>('/api/projects'), { initialValue: [] as Project[] });
  readonly skills = toSignal(this.list<Skill>('/api/skills'), { initialValue: [] as Skill[] });
  readonly experience = toSignal(this.list<Experience>('/api/experience'), { initialValue: [] as Experience[] });

  readonly metrics = computed(() => ({
    years: careerYears(this.experience()),
    projectCount: this.projects().length,
    featuredCount: this.projects().filter((p) => p.featured).length,
  }));
}
