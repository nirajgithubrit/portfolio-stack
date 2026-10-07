import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../core/site-settings.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="container row">
        <p>&copy; {{ year }} {{ settings()?.fullName || 'Portfolio' }}. Built with Angular, Node.js &amp; MongoDB.</p>
        <div class="links">
          @for (s of settings()?.socials ?? []; track s.url) {
            <a [href]="s.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="s.platform">
              @if (has(s.icon)) { <app-icon [name]="s.icon!.toLowerCase()" [size]="18" /> } @else { {{ s.platform }} }
            </a>
          }
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { position: relative; z-index: 2; border-top: 1px solid var(--border); padding: 2rem 0; background: var(--footer-bg); backdrop-filter: blur(10px); }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; color: var(--muted); font-size: .9rem; }
    .links { display: flex; align-items: center; gap: 1rem; }
    .links a { transition: color .25s, transform .25s; display: inline-block; }
    .links a:hover { color: var(--accent); transform: translateY(-3px); }
  `],
})
export class FooterComponent {
  readonly settings = toSignal(inject(SiteSettingsService).settings$, { initialValue: null });
  readonly year = new Date().getFullYear();
  has = (n?: string) => IconComponent.has((n ?? '').toLowerCase());
}
