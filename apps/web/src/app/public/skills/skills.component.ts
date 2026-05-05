import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import type { Skill } from '../../shared/models';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  private readonly http = inject(HttpClient);

  readonly skills = toSignal(
    this.http.get<Skill[]>('/api/skills').pipe(catchError(() => of([]))),
    { initialValue: [] as Skill[] }
  );

  readonly groupedSkills = computed(() => {
    const groups = new Map<string, Skill[]>();
    for (const skill of this.skills()) {
      const key = skill.category || 'General';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)?.push(skill);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
  });

  trackById = (_: number, s: Skill) => s._id;
}
