import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  AfterViewInit,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AboutComponent } from '../about/about.component';
import { ProjectsComponent } from '../projects/projects.component';
import { SkillsComponent } from '../skills/skills.component';
import { ContactComponent } from '../contact/contact.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../../core/site-settings.service';
import { PORTFOLIO_THEME_IDS, ThemeService, type PortfolioThemeId } from '../../core/theme.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import type { Experience, Project } from '../../shared/models';

function careerYearsFromExperience(rows: Experience[]): number {
  if (!rows.length) return 0;
  const now = Date.now();
  let earliest = now;
  for (const r of rows) {
    const t = new Date(r.startDate).getTime();
    if (!Number.isNaN(t) && t < earliest) earliest = t;
  }
  return Math.max(0, Math.floor((now - earliest) / (365.25 * 24 * 60 * 60 * 1000)));
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AboutComponent, ProjectsComponent, SkillsComponent, ContactComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly siteSettings = inject(SiteSettingsService);
  private readonly http = inject(HttpClient);
  readonly theme = inject(ThemeService);

  readonly settings = toSignal(this.siteSettings.settings$, { initialValue: null });
  readonly lines = computed(() => {
    const fromSettings = this.settings()?.taglineLines ?? [];
    return fromSettings.length ? fromSettings : ['Angular · Node · MongoDB', 'APIs, auth, and polished UI'];
  });

  readonly heroMetrics = toSignal(
    forkJoin({
      experience: this.http.get<Experience[]>('/api/experience').pipe(catchError(() => of([]))),
      projects: this.http.get<Project[]>('/api/projects').pipe(catchError(() => of([]))),
    }).pipe(
      map(({ experience, projects }) => ({
        years: careerYearsFromExperience(experience),
        projectCount: projects.length,
        featuredCount: projects.filter((p) => p.featured).length,
      }))
    ),
    { initialValue: { years: 0, projectCount: 0, featuredCount: 0 } }
  );

  readonly typedText = signal('');
  readonly showTopButton = signal(false);
  readonly showThemeMenu = signal(false);
  readonly themeOptions: ReadonlyArray<{ id: PortfolioThemeId; label: string; description: string }> = [
    { id: 'night', label: 'Night', description: 'Current dark default' },
    { id: 'daylight', label: 'Daylight', description: 'Bright clean light mode' },
    { id: 'ocean', label: 'Ocean', description: 'Teal and aqua' },
    { id: 'forest', label: 'Forest', description: 'Green natural palette' },
    { id: 'sunset', label: 'Sunset', description: 'Warm orange and pink' },
  ] as const;
  private lineIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timeoutId = 0;
  private readonly onScroll = (): void => {
    this.showTopButton.set(window.scrollY > 300);
  };

  ngOnInit(): void {
    const speed = 42;
    const deleteSpeed = 28;
    const pauseAtEnd = 1600;

    const tick = (): number => {
      const currentLines = this.lines();
      if (this.lineIndex >= currentLines.length) this.lineIndex = 0;
      const line = currentLines[this.lineIndex] ?? '';
      if (!this.deleting && this.charIndex < line.length) {
        this.charIndex++;
        this.typedText.set(line.slice(0, this.charIndex));
        return speed;
      }
      if (!this.deleting && this.charIndex >= line.length) {
        this.deleting = true;
        return pauseAtEnd;
      }
      if (this.deleting && this.charIndex > 0) {
        this.charIndex--;
        this.typedText.set(line.slice(0, this.charIndex));
        return deleteSpeed;
      }
      this.deleting = false;
      this.lineIndex = (this.lineIndex + 1) % currentLines.length;
      return 400;
    };

    const schedule = (): void => {
      const delay = tick();
      this.timeoutId = window.setTimeout(schedule, delay);
    };
    schedule();
    this.onScroll();
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.destroyRef.onDestroy(() => {
      clearTimeout(this.timeoutId);
      window.removeEventListener('scroll', this.onScroll);
    });
  }

  ngAfterViewInit(): void {
    const sub = this.route.fragment.subscribe((fragment) => {
      if (!fragment) return;
      requestAnimationFrame(() => {
        document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleThemeMenu(): void {
    this.showThemeMenu.update((v) => !v);
  }

  setTheme(themeId: PortfolioThemeId): void {
    if (!(PORTFOLIO_THEME_IDS as readonly string[]).includes(themeId)) return;
    this.theme.applyUserChoice(themeId);
    this.showThemeMenu.set(false);
  }

  isThemeActive(themeId: PortfolioThemeId): boolean {
    return this.theme.currentThemeId() === themeId;
  }

  socialIconPath(icon?: string): string {
    switch ((icon ?? '').toLowerCase()) {
      case 'github':
        return 'M12 2.75a9.25 9.25 0 0 0-2.93 18.02c.46.09.63-.2.63-.45v-1.73c-2.57.56-3.11-1.09-3.11-1.09-.42-1.08-1.02-1.37-1.02-1.37-.84-.57.06-.56.06-.56.92.07 1.41.95 1.41.95.83 1.42 2.17 1.01 2.7.78.08-.6.32-1.01.58-1.24-2.05-.24-4.2-1.02-4.2-4.55 0-1 .36-1.82.94-2.46-.09-.24-.41-1.2.09-2.5 0 0 .77-.24 2.53.94a8.69 8.69 0 0 1 4.61 0c1.76-1.18 2.53-.94 2.53-.94.5 1.3.18 2.26.09 2.5.58.64.94 1.46.94 2.46 0 3.54-2.16 4.31-4.22 4.54.33.29.62.86.62 1.73v2.56c0 .25.16.54.64.45A9.25 9.25 0 0 0 12 2.75z';
      case 'linkedin':
        return 'M6.08 8.64a1.33 1.33 0 1 1 0-2.66 1.33 1.33 0 0 1 0 2.66zM4.94 18.02V9.88h2.29v8.14H4.94zm3.92 0V9.88h2.2v1.11h.03c.31-.58 1.06-1.2 2.19-1.2 2.35 0 2.79 1.55 2.79 3.56v4.67h-2.29V13.9c0-.98-.02-2.24-1.37-2.24-1.37 0-1.58 1.07-1.58 2.17v4.19h-2.29z';
      default:
        return '';
    }
  }
}
