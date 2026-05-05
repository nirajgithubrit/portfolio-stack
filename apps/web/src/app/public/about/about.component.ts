import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import type { Experience, Skill } from '../../shared/models';
import { SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('timeline', [
      transition(':enter', [
        query(
          '.tl-item',
          [
            style({ opacity: 0, transform: 'translateY(12px)' }),
            stagger(80, [animate('280ms ease-out', style({ opacity: 1, transform: 'none' }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class AboutComponent {
  private readonly http = inject(HttpClient);
  private readonly siteSettings = inject(SiteSettingsService);

  readonly skills = toSignal(
    this.http.get<Skill[]>('/api/skills').pipe(catchError(() => of([]))),
    { initialValue: [] as Skill[] }
  );

  readonly experience = toSignal(
    this.http.get<Experience[]>('/api/experience').pipe(catchError(() => of([]))),
    { initialValue: [] as Experience[] }
  );

  readonly settings = toSignal(this.siteSettings.settings$, { initialValue: null });

  trackSkill = (_: number, s: Skill) => s._id;
  trackExp = (_: number, e: Experience) => e._id;
}
