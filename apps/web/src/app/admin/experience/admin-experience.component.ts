import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Experience } from '../../shared/models';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './admin-experience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Experience[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly editing = signal<Experience | null>(null);

  readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    title: ['', Validators.required],
    location: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    description: ['', Validators.required],
    order: [0, Validators.required],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.error.set(null);
    this.http.get<Experience[]>('/api/experience').subscribe({
      next: (rows) => this.items.set(rows),
      error: () => this.error.set('Failed to load experience'),
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body = {
      company: v.company,
      title: v.title,
      location: v.location,
      startDate: new Date(v.startDate).toISOString(),
      endDate: v.endDate ? new Date(v.endDate).toISOString() : null,
      description: v.description,
      order: Number(v.order) || 0,
    };
    this.busy.set(true);
    this.http.post<Experience>('/api/experience', body).subscribe({
      next: () => {
        this.busy.set(false);
        this.form.reset({ order: 0, location: '', endDate: '' });
        this.reload();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'Create failed');
      },
    });
  }

  startEdit(x: Experience): void {
    this.editing.set({ ...x });
  }

  patch<K extends keyof Experience>(key: K, value: Experience[K]): void {
    const cur = this.editing();
    if (!cur) return;
    this.editing.set({ ...cur, [key]: value });
  }

  toInputDate(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  }

  saveEdit(): void {
    const x = this.editing();
    if (!x) return;
    this.busy.set(true);
    const { _id, ...rest } = x;
    const body = {
      ...rest,
      startDate: new Date(rest.startDate as unknown as string).toISOString(),
      endDate: rest.endDate ? new Date(rest.endDate as unknown as string).toISOString() : null,
    };
    this.http.put<Experience>(`/api/experience/${_id}`, body).subscribe({
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

  deleteExp(id: string): void {
    if (!confirm('Delete?')) return;
    this.http.delete(`/api/experience/${id}`).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Delete failed'),
    });
  }

  trackById = (_: number, x: Experience) => x._id;
}
