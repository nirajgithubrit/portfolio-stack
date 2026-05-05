import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly siteSettings = inject(SiteSettingsService);
  readonly settings = toSignal(this.siteSettings.settings$, { initialValue: null });

  readonly submitting = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly showSuccessModal = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.maxLength(4000)]],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.success.set(null);
      this.error.set(null);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.http.post<{ message: string }>('/api/contact', this.form.getRawValue()).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.success.set(res.message ?? 'Message sent successfully.');
        this.showSuccessModal.set(true);
        this.form.reset();
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.message ?? 'Could not send message.';
        this.error.set(msg);
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
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
