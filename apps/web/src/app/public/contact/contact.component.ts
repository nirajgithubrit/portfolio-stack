import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { SiteSettings } from '../../shared/models';
import { RevealDirective } from '../../core/directives';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">Contact</span>
          <h2>Let's build <span class="gradient-text">something great</span></h2>
          <p>Have a project in mind or just want to say hi? Send a message and I'll get back to you soon.</p>
        </div>

        <div class="wrap">
          <aside reveal="left">
            <div class="card item"><span class="ico"><app-icon name="mail" /></span><div><small>Email</small>
              @if (settings.contactEmail) { <a [href]="'mailto:' + settings.contactEmail">{{ settings.contactEmail }}</a> } @else { <span>Set contact email in admin</span> }
            </div></div>
            @if (settings.phone) {
              <div class="card item"><span class="ico"><app-icon name="phone" /></span><div><small>Phone</small><span>{{ settings.phone }}</span></div></div>
            }
            <div class="card item"><span class="ico"><app-icon name="pin" /></span><div><small>Location{{ settings.timezone ? ' · ' + settings.timezone : '' }}</small><span>{{ settings.locationLabel }}</span></div></div>
            @if (settings.socials.length) {
              <div class="soc">
                @for (s of settings.socials; track s.url) {
                  <a class="btn ghost sm" [href]="s.url" target="_blank" rel="noopener noreferrer">
                    @if (has(s.icon)) { <app-icon [name]="s.icon!.toLowerCase()" [size]="16" /> } {{ s.platform }}
                  </a>
                }
              </div>
            }
          </aside>

          <form class="card form" [formGroup]="form" (ngSubmit)="submit()" reveal="right">
            <div class="two">
              <div class="field">
                <label for="name">Name</label>
                <input id="name" formControlName="name" placeholder="Your name" autocomplete="name" />
                @if (invalid('name')) { <em>Please enter your name</em> }
              </div>
              <div class="field">
                <label for="email">Email</label>
                <input id="email" type="email" formControlName="email" placeholder="you@example.com" autocomplete="email" />
                @if (invalid('email')) { <em>Enter a valid email</em> }
              </div>
            </div>
            <div class="field">
              <label for="subject">Subject</label>
              <input id="subject" formControlName="subject" placeholder="What is this about?" />
              @if (invalid('subject')) { <em>Subject required</em> }
            </div>
            <div class="field">
              <label for="message">Message</label>
              <textarea id="message" formControlName="message" placeholder="Tell me about your project..."></textarea>
              @if (invalid('message')) { <em>Message required (max 4000 chars)</em> }
            </div>

            <button class="btn primary" type="submit" [disabled]="submitting()">
              {{ submitting() ? 'Sending...' : 'Send message' }} <app-icon name="send" [size]="18" />
            </button>

            @if (error(); as err) { <p class="note err">{{ err }}</p> }
          </form>
        </div>
      </div>

      @if (showSuccessModal()) {
        <div class="overlay" (click)="closeSuccessModal()">
          <div class="card dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
            <span class="okico"><app-icon name="check" [size]="30" /></span>
            <h3>Message sent</h3>
            <p>{{ success() }}</p>
            <button class="btn primary" type="button" (click)="closeSuccessModal()">OK</button>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .wrap { display: grid; grid-template-columns: 1fr 1.6fr; gap: 2rem; align-items: start; }
    aside { display: grid; gap: 1rem; }
    .item { display: flex; align-items: center; gap: 1rem; padding: 1.3rem 1.5rem; }
    .item:hover { border-color: var(--primary); transform: translateX(6px); }
    .ico { width: 48px; height: 48px; border-radius: 14px; background: var(--grad); color: var(--gradient-btn-text); display: grid; place-items: center; flex-shrink: 0; }
    small { display: block; color: var(--muted); font-size: .78rem; }
    .item a:hover { color: var(--accent); }
    .item div { min-width: 0; overflow-wrap: anywhere; }
    .soc { display: flex; flex-wrap: wrap; gap: .6rem; }
    .btn.sm { padding: .45rem .9rem; font-size: .85rem; }
    .form { padding: 2rem; display: grid; gap: 1.2rem; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    em { font-style: normal; color: #ff6b7d; font-size: .8rem; }
    .form .btn { justify-self: start; }
    .note { font-size: .9rem; animation: pop .4s; }
    .err { color: #ff6b7d; }
    .overlay { position: fixed; inset: 0; z-index: 200; background: var(--modal-backdrop); backdrop-filter: blur(8px); display: grid; place-items: center; padding: 1.5rem; animation: fade .3s; }
    .dialog { width: min(420px, 100%); padding: 2.2rem; text-align: center; display: grid; justify-items: center; gap: .8rem; background: var(--surface-elevated); animation: zoom .4s cubic-bezier(.2,.7,.2,1); }
    .dialog p { color: var(--muted); margin-bottom: .6rem; }
    .okico { width: 64px; height: 64px; border-radius: 50%; background: var(--grad); color: var(--gradient-btn-text); display: grid; place-items: center; animation: zoom .6s .15s cubic-bezier(.2,.7,.2,1) both; }
    @keyframes pop { from { opacity: 0; transform: translateY(8px); } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes zoom { from { opacity: 0; transform: scale(.8); } }
    @media (max-width: 860px) { .wrap, .two { grid-template-columns: 1fr; } }
  `],
})
export class ContactComponent {
  @Input({ required: true }) settings!: SiteSettings;
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

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

  has = (n?: string) => IconComponent.has((n ?? '').toLowerCase());

  invalid(c: 'name' | 'email' | 'subject' | 'message'): boolean {
    const ctrl = this.form.controls[c];
    return ctrl.invalid && (ctrl.touched || ctrl.dirty);
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
        this.form.reset();
        this.success.set(res.message ?? 'Message sent successfully.');
        this.showSuccessModal.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message ?? 'Could not send message.');
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }
}
