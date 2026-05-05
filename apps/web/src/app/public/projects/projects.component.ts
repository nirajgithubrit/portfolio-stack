import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import type { Project } from '../../shared/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modal', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('180ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('120ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProjectsComponent {
  private readonly http = inject(HttpClient);

  readonly projects = toSignal(
    this.http.get<Project[]>('/api/projects').pipe(catchError(() => of([]))),
    { initialValue: [] as Project[] }
  );

  readonly selected = signal<Project | null>(null);

  trackById = (_: number, p: Project) => p._id;

  open(p: Project): void {
    this.selected.set(p);
  }

  close(): void {
    this.selected.set(null);
  }
}
