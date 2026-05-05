import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../core/site-settings.service';

type NavLink = {
  path: string;
  label: string;
  exact: boolean;
  fragment?: string;
  icon: 'home' | 'about' | 'projects' | 'skills' | 'contact';
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly siteSettings = inject(SiteSettingsService);

  readonly settings = toSignal(this.siteSettings.settings$, { initialValue: null });

  readonly navLinks: readonly NavLink[] = [
    { path: '/', fragment: undefined, label: 'Home', exact: true, icon: 'home' },
    { path: '/', fragment: 'about', label: 'About', exact: false, icon: 'about' },
    { path: '/', fragment: 'projects', label: 'Projects', exact: false, icon: 'projects' },
    { path: '/', fragment: 'skills', label: 'Skills', exact: false, icon: 'skills' },
    { path: '/', fragment: 'contact', label: 'Contact', exact: false, icon: 'contact' },
  ] as const;

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  iconPath(icon: NavLink['icon']): string {
    switch (icon) {
      case 'home':
        return 'M3 10.75 12 3l9 7.75M5.25 9.5v10.25c0 .41.34.75.75.75h4.5v-5.25c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v5.25H18c.41 0 .75-.34.75-.75V9.5';
      case 'about':
        return 'M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0';
      case 'projects':
        return 'M2.75 7.5h6l1.5-2.25h11a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H2.75a.75.75 0 0 1-.75-.75v-9.75c0-.41.34-.75.75-.75z';
      case 'skills':
        return 'M12 3.75 14.1 8.01l4.7.69-3.4 3.32.8 4.68L12 14.52 7.8 16.7l.8-4.68L5.2 8.7l4.7-.69L12 3.75z';
      case 'contact':
        return 'M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75zm1.86-.75L12 11.01 19.14 6';
    }
  }
}
