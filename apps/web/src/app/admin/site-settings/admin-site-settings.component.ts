import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SiteSettingsService } from '../../core/site-settings.service';
import type { SiteSettings } from '../../shared/models';
import { PORTFOLIO_THEME_IDS, type PortfolioThemeId } from '../../core/theme.service';

@Component({
  selector: 'app-admin-site-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-site-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSiteSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly settingsService = inject(SiteSettingsService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly uploadingProfile = signal(false);
  readonly uploadingLogo = signal(false);
  readonly uploadingResume = signal(false);
  readonly assetError = signal<string | null>(null);
  private hasPatchedInitial = false;

  readonly themeIds = PORTFOLIO_THEME_IDS;
  readonly themeLabels: Record<PortfolioThemeId, string> = {
    night: 'Night (default)',
    daylight: 'Daylight',
    ocean: 'Ocean',
    forest: 'Forest',
    sunset: 'Sunset',
  };

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    headline: ['', Validators.required],
    taglineLinesText: [''],
    aboutSummary: ['', Validators.required],
    locationLabel: [''],
    profilePhotoUrl: [''],
    logoUrl: [''],
    resumeUrl: [''],
    contactEmail: [''],
    phone: [''],
    timezone: [''],
    heroStatsText: [''],
    seoTitle: [''],
    seoDescription: [''],
    themeId: this.fb.nonNullable.control<PortfolioThemeId>('night'),
    socials: this.fb.array([] as ReturnType<typeof this.createSocialGroup>[]),
  });

  get socials(): FormArray {
    return this.form.controls.socials;
  }

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings) => {
      if (!this.hasPatchedInitial || !this.form.dirty) {
        this.patch(settings);
        this.hasPatchedInitial = true;
      }
    });
  }

  addSocial(): void {
    this.socials.push(this.createSocialGroup('', '', ''));
  }

  removeSocial(index: number): void {
    this.socials.removeAt(index);
  }

  onProfileFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.assetError.set(null);
    this.uploadingProfile.set(true);
    const fd = new FormData();
    fd.append('file', file);
    this.http.post<{ url: string }>('/api/uploads/site/profile', fd).subscribe({
      next: (res) => {
        this.form.patchValue({ profilePhotoUrl: res.url });
        this.persistAssetChange('Profile photo uploaded and saved.');
        this.uploadingProfile.set(false);
        input.value = '';
      },
      error: (err: { error?: { message?: string } }) => {
        this.assetError.set(err?.error?.message ?? 'Profile image upload failed');
        this.uploadingProfile.set(false);
        input.value = '';
      },
    });
  }

  onLogoFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.assetError.set(null);
    this.uploadingLogo.set(true);
    const fd = new FormData();
    fd.append('file', file);
    this.http.post<{ url: string }>('/api/uploads/site/logo', fd).subscribe({
      next: (res) => {
        this.form.patchValue({ logoUrl: res.url });
        this.persistAssetChange('Logo uploaded and saved.');
        this.uploadingLogo.set(false);
        input.value = '';
      },
      error: (err: { error?: { message?: string } }) => {
        this.assetError.set(err?.error?.message ?? 'Logo upload failed');
        this.uploadingLogo.set(false);
        input.value = '';
      },
    });
  }

  onResumeFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.assetError.set(null);
    this.uploadingResume.set(true);
    const fd = new FormData();
    fd.append('file', file);
    this.http.post<{ url: string }>('/api/uploads/site/resume', fd).subscribe({
      next: (res) => {
        this.form.patchValue({ resumeUrl: res.url });
        this.persistAssetChange('Resume uploaded and saved.');
        this.uploadingResume.set(false);
        input.value = '';
      },
      error: (err: { error?: { message?: string } }) => {
        this.assetError.set(err?.error?.message ?? 'Resume upload failed');
        this.uploadingResume.set(false);
        input.value = '';
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.success.set(null);
    this.assetError.set(null);
    this.settingsService.update(this.buildPayload()).subscribe({
      next: (saved) => {
        this.patch(saved);
        this.form.markAsPristine();
        this.busy.set(false);
        this.success.set('Site settings updated.');
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Could not update settings.');
      },
    });
  }

  private persistAssetChange(message: string): void {
    this.assetError.set(null);
    this.settingsService.update(this.buildPayload()).subscribe({
      next: (saved) => {
        this.patch(saved);
        this.form.markAsPristine();
        this.success.set(message);
      },
      error: (err: { error?: { message?: string } }) => {
        this.assetError.set(err?.error?.message ?? 'Uploaded file but could not save site settings.');
      },
    });
  }

  private buildPayload(): SiteSettings {
    const raw = this.form.getRawValue();
    return {
      fullName: raw.fullName,
      headline: raw.headline,
      taglineLines: this.csvLines(raw.taglineLinesText),
      aboutSummary: raw.aboutSummary,
      locationLabel: raw.locationLabel,
      profilePhotoUrl: raw.profilePhotoUrl,
      logoUrl: raw.logoUrl,
      resumeUrl: raw.resumeUrl,
      contactEmail: raw.contactEmail,
      phone: raw.phone,
      timezone: raw.timezone,
      socials: raw.socials
        .map((s) => ({ platform: s.platform.trim(), url: s.url.trim(), icon: s.icon.trim() }))
        .filter((s) => s.platform && s.url),
      heroStats: this.csvLines(raw.heroStatsText),
      seoTitle: raw.seoTitle,
      seoDescription: raw.seoDescription,
      themeId: raw.themeId,
    };
  }

  private patch(settings: SiteSettings): void {
    this.form.patchValue({
      fullName: settings.fullName,
      headline: settings.headline,
      taglineLinesText: settings.taglineLines.join('\n'),
      aboutSummary: settings.aboutSummary,
      locationLabel: settings.locationLabel,
      profilePhotoUrl: settings.profilePhotoUrl,
      logoUrl: settings.logoUrl,
      resumeUrl: settings.resumeUrl,
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      timezone: settings.timezone,
      heroStatsText: settings.heroStats.join('\n'),
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      themeId: (settings.themeId as PortfolioThemeId) ?? 'night',
    });
    this.socials.clear();
    for (const s of settings.socials) {
      this.socials.push(this.createSocialGroup(s.platform, s.url, s.icon ?? ''));
    }
  }

  private csvLines(value: string): string[] {
    return value
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  private createSocialGroup(platform: string, url: string, icon: string) {
    return this.fb.nonNullable.group({
      platform: [platform, Validators.required],
      url: [url, Validators.required],
      icon: [icon],
    });
  }
}
