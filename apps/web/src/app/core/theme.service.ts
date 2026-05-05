import { Injectable, inject } from '@angular/core';
import { SiteSettingsService } from './site-settings.service';

export const PORTFOLIO_THEME_IDS = ['night', 'daylight', 'ocean', 'forest', 'sunset'] as const;
export type PortfolioThemeId = (typeof PORTFOLIO_THEME_IDS)[number];

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly siteSettings = inject(SiteSettingsService);

  init(): void {
    const saved = this.getStoredTheme();
    if (saved && this.isValidTheme(saved)) {
      this.apply(saved);
    } else {
      this.apply('night');
    }

    this.siteSettings.settings$.subscribe((s) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      if (s?.themeId && this.isValidTheme(s.themeId)) {
        this.apply(s.themeId);
      }
    });
  }

  /** Visitor override: saved in localStorage and survives reloads. */
  applyUserChoice(themeId: PortfolioThemeId): void {
    localStorage.setItem(STORAGE_KEY, themeId);
    this.apply(themeId);
  }

  /** Follow admin default until user picks a theme in this browser. */
  clearUserOverride(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.siteSettings.refresh();
  }

  cycleTheme(): void {
    const current = (document.documentElement.getAttribute('data-theme') ?? 'night') as PortfolioThemeId;
    const idx = PORTFOLIO_THEME_IDS.indexOf(current);
    const next = PORTFOLIO_THEME_IDS[(idx === -1 ? 0 : idx + 1) % PORTFOLIO_THEME_IDS.length];
    this.applyUserChoice(next);
  }

  currentThemeId(): PortfolioThemeId {
    const raw = document.documentElement.getAttribute('data-theme');
    return raw && this.isValidTheme(raw) ? raw : 'night';
  }

  private getStoredTheme(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  private isValidTheme(id: string): id is PortfolioThemeId {
    return (PORTFOLIO_THEME_IDS as readonly string[]).includes(id);
  }

  private apply(themeId: PortfolioThemeId): void {
    const id = this.isValidTheme(themeId) ? themeId : 'night';
    document.documentElement.setAttribute('data-theme', id);
  }
}
