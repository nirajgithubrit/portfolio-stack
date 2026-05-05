import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Project } from '../../shared/models';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Project[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly editing = signal<Project | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: [''],
    githubUrl: [''],
    liveUrl: [''],
    techStack: [''],
    status: ['completed' as 'completed' | 'live'],
    role: ['fullstack' as 'frontend' | 'fullstack'],
    duration: [''],
    featured: [false],
    order: [0, Validators.required],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.error.set(null);
    this.http.get<Project[]>('/api/projects').subscribe({
      next: (rows) => this.items.set(rows),
      error: () => this.error.set('Failed to load projects'),
    });
  }

  private techArray(raw: string): string[] {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload = {
      title: v.title,
      slug: v.slug,
      summary: v.summary,
      description: v.description,
      imageUrl: v.imageUrl,
      githubUrl: v.githubUrl,
      liveUrl: v.liveUrl,
      techStack: this.techArray(v.techStack),
      status: v.status,
      role: v.role,
      duration: v.duration,
      featured: v.featured,
      order: Number(v.order) || 0,
    };
    this.busy.set(true);
    this.http.post<Project>('/api/projects', payload).subscribe({
      next: () => {
        this.busy.set(false);
        this.form.reset({
          featured: false,
          order: 0,
          imageUrl: '',
          githubUrl: '',
          liveUrl: '',
          techStack: '',
          status: 'completed',
          role: 'fullstack',
          duration: '',
        });
        this.reload();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'Create failed');
      },
    });
  }

  startEdit(p: Project): void {
    this.editing.set({ ...p, techStack: [...p.techStack] });
  }

  patchEdit<K extends keyof Project>(key: K, value: Project[K]): void {
    const cur = this.editing();
    if (!cur) return;
    this.editing.set({ ...cur, [key]: value });
  }

  techStackString(): string {
    const e = this.editing();
    return e ? e.techStack.join(', ') : '';
  }

  setTechStackFromInput(raw: string): void {
    const cur = this.editing();
    if (!cur) return;
    this.editing.set({ ...cur, techStack: this.techArray(raw) });
  }

  saveEdit(): void {
    const p = this.editing();
    if (!p) return;
    this.busy.set(true);
    const { _id, createdAt, updatedAt, ...rest } = p as Project & {
      createdAt?: string;
      updatedAt?: string;
    };
    const body = { ...rest } as Omit<Project, '_id' | 'createdAt' | 'updatedAt'>;
    this.http.put<Project>(`/api/projects/${_id}`, body).subscribe({
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

  deleteProject(id: string): void {
    if (!confirm('Delete this project?')) return;
    this.http.delete(`/api/projects/${id}`).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Delete failed'),
    });
  }

  trackById = (_: number, p: Project) => p._id;
}
