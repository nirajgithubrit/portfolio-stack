import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Skill } from '../../shared/models';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSkillsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Skill[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly editing = signal<Skill | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    proficiency: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    order: [0, Validators.required],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.error.set(null);
    this.http.get<Skill[]>('/api/skills').subscribe({
      next: (rows) => this.items.set(rows),
      error: () => this.error.set('Failed to load skills'),
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.busy.set(true);
    this.http
      .post<Skill>('/api/skills', {
        name: v.name,
        category: v.category,
        proficiency: Number(v.proficiency),
        order: Number(v.order) || 0,
      })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.form.reset({ proficiency: 80, order: 0 });
          this.reload();
        },
        error: (err) => {
          this.busy.set(false);
          this.error.set(err?.error?.message ?? 'Create failed');
        },
      });
  }

  startEdit(s: Skill): void {
    this.editing.set({ ...s });
  }

  patch<K extends keyof Skill>(key: K, value: Skill[K]): void {
    const cur = this.editing();
    if (!cur) return;
    this.editing.set({ ...cur, [key]: value });
  }

  saveEdit(): void {
    const s = this.editing();
    if (!s) return;
    this.busy.set(true);
    const { _id, ...body } = s;
    this.http.put<Skill>(`/api/skills/${_id}`, body).subscribe({
      next: () => {
        this.busy.set(false);
        this.editing.set(null);
        this.reload();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'Update failed');
      },
    });
  }

  closeEdit(): void {
    this.editing.set(null);
  }

  deleteSkill(id: string): void {
    if (!confirm('Delete?')) return;
    this.http.delete(`/api/skills/${id}`).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Delete failed'),
    });
  }

  trackById = (_: number, x: Skill) => x._id;
}
