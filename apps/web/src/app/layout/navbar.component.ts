import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../core/site-settings.service';
import { PortfolioDataService } from '../core/portfolio-data.service';
import { IconComponent } from '../shared/icon.component';
import { ThemePickerComponent } from '../shared/theme-picker.component';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, ThemePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="progress" [style.transform]="'scaleX(' + progress() + ')'"></div>
    <header [class.scrolled]="scrolled()">
      <div class="container bar">
        <a class="logo" href="#home" (click)="go($event, 'home')">
          <img class="mark" [src]="settings()?.logoUrl || '/logo.png'" alt="" width="38" height="38" />
          <span class="name">{{ settings()?.fullName || 'Portfolio' }}</span>
        </a>

        <nav [class.open]="open()">
          @for (l of links(); track l.id) {
            <a [href]="'#' + l.id" [class.active]="active() === l.id" (click)="go($event, l.id)">{{ l.label }}</a>
          }
        </nav>

        <div class="actions">
          <app-theme-picker />
          <button class="icon-btn burger" (click)="open.set(!open())" aria-label="Menu">
            <app-icon [name]="open() ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--grad); transform-origin: left; z-index: 101; }
    header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.2rem 0; transition: all .35s; }
    header.scrolled { padding: .6rem 0; background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .logo { display: flex; align-items: center; gap: .7rem; font-family: 'Space Grotesk'; font-weight: 700; font-size: 1.1rem; }
    .mark { width: 38px; height: 38px; border-radius: 12px; object-fit: cover; box-shadow: var(--glow); transition: transform .4s; }
    .logo:hover .mark { transform: rotate(-12deg) scale(1.1); }
    nav { display: flex; gap: .3rem; }
    nav a { padding: .5rem 1rem; border-radius: 999px; font-size: .92rem; color: var(--muted); position: relative; transition: color .25s, background .25s; }
    nav a:hover { color: var(--text); }
    nav a.active { color: var(--text); background: var(--surface-2); }
    .actions { display: flex; gap: .5rem; }
    .icon-btn { width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); display: grid; place-items: center; color: var(--text); transition: transform .3s, border-color .3s; }
    .icon-btn:hover { border-color: var(--primary); transform: rotate(20deg); }
    .burger { display: none; }
    @media (max-width: 880px) {
      .burger { display: grid; }
      .name { max-width: 9.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      nav { position: fixed; inset: 70px 1rem auto 1rem; flex-direction: column; padding: 1rem; background: var(--nav-mobile-bg); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); opacity: 0; transform: translateY(-12px); pointer-events: none; transition: all .3s; }
      nav.open { opacity: 1; transform: none; pointer-events: auto; }
      nav a { padding: .8rem 1rem; }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly data = inject(PortfolioDataService);
  readonly settings = toSignal(inject(SiteSettingsService).settings$, { initialValue: null });

  readonly links = computed(() => LINKS.filter((l) => l.id !== 'experience' || this.data.experience().length > 0));
  readonly open = signal(false);
  readonly scrolled = signal(false);
  readonly progress = signal(0);
  readonly active = signal('home');
  private io?: IntersectionObserver;
  private observeTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    // Scroll spy: the section crossing the middle of the viewport is "active"
    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) this.active.set(e.target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });
    this.observeTimer = setTimeout(
      () => LINKS.forEach((l) => { const el = document.getElementById(l.id); if (el) this.io!.observe(el); }),
      800
    );
    this.onScroll();
  }

  ngOnDestroy() {
    this.io?.disconnect();
    clearTimeout(this.observeTimer);
  }

  @HostListener('window:scroll') onScroll() {
    const y = window.scrollY;
    this.scrolled.set(y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    this.progress.set(max > 0 ? Math.min(y / max, 1) : 0);
  }

  go(e: Event, id: string) {
    e.preventDefault();
    this.open.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
