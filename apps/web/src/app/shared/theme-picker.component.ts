import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { PORTFOLIO_THEME_IDS, ThemeService, type PortfolioThemeId } from '../core/theme.service';
import { IconComponent } from './icon.component';

/** Visitor theme switcher (overrides the admin default in this browser). */
@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="icon-btn" type="button" (click)="toggle($event)" aria-label="Change color theme" title="Theme">
      <app-icon name="palette" />
    </button>
    @if (open()) {
      <div class="menu card" (click)="$event.stopPropagation()">
        <b>Choose theme</b>
        <small>Select your preferred color scheme</small>
        @for (opt of options; track opt.id) {
          <button type="button" class="opt" [class.on]="active() === opt.id" (click)="pick(opt.id)">
            <span><strong>{{ opt.label }}</strong><em>{{ opt.description }}</em></span>
            <i></i>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    :host { position: relative; display: inline-block; }
    .icon-btn { width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); display: grid; place-items: center; transition: transform .3s, border-color .3s; color: var(--text); }
    .icon-btn:hover { border-color: var(--primary); transform: rotate(20deg); }
    .menu { position: absolute; top: 54px; right: 0; width: min(290px, calc(100vw - 2rem)); padding: .9rem; background: var(--surface-elevated); box-shadow: var(--shadow); animation: drop .25s cubic-bezier(.2,.7,.2,1); display: grid; gap: .2rem; z-index: 120; }
    .menu small { color: var(--muted); font-size: .75rem; margin-bottom: .5rem; }
    .opt { display: flex; align-items: center; justify-content: space-between; text-align: left; padding: .55rem .7rem; border-radius: 12px; border: 0; background: transparent; transition: background .25s, transform .25s; }
    .opt:hover { transform: translateX(4px); background: var(--surface-2); }
    .opt.on { background: var(--accent-soft); }
    .opt span { display: grid; }
    .opt em { font-style: normal; font-size: .75rem; color: var(--muted); }
    .opt i { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
    .opt.on i { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
    @keyframes drop { from { opacity: 0; transform: translateY(-10px) scale(.96); } }
  `],
})
export class ThemePickerComponent {
  private theme = inject(ThemeService);
  readonly open = signal(false);
  readonly active = signal<PortfolioThemeId>(this.theme.currentThemeId());
  readonly options: ReadonlyArray<{ id: PortfolioThemeId; label: string; description: string }> = [
    { id: 'night', label: 'Night', description: 'Dark default' },
    { id: 'daylight', label: 'Daylight', description: 'Bright clean light mode' },
    { id: 'ocean', label: 'Ocean', description: 'Teal and aqua' },
    { id: 'forest', label: 'Forest', description: 'Green natural palette' },
    { id: 'sunset', label: 'Sunset', description: 'Warm orange and pink' },
  ];

  toggle(e: Event) {
    e.stopPropagation();
    this.active.set(this.theme.currentThemeId());
    this.open.update((v) => !v);
  }

  pick(id: PortfolioThemeId) {
    if (!(PORTFOLIO_THEME_IDS as readonly string[]).includes(id)) return;
    this.theme.applyUserChoice(id);
    this.active.set(id);
    this.open.set(false);
  }

  @HostListener('document:click') close() { this.open.set(false); }
  @HostListener('document:keydown.escape') esc() { this.open.set(false); }
}
