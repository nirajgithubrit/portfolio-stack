import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { BackgroundComponent } from '../shared/background.component';
import { CursorComponent } from '../shared/cursor.component';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, BackgroundComponent, CursorComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-background />
    <app-cursor />
    <app-navbar />
    <main><router-outlet /></main>
    <app-footer />

    <button class="top" [class.show]="showTop()" type="button" (click)="toTop()" aria-label="Scroll to top">
      <app-icon name="arrow" [size]="20" />
    </button>
  `,
  styles: [`
    :host { display: block; }
    main { position: relative; z-index: 2; }
    .top { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 90; width: 48px; height: 48px; border-radius: 50%; border: 0; background: var(--grad); color: var(--gradient-btn-text); display: grid; place-items: center; box-shadow: var(--glow); opacity: 0; transform: translateY(20px) scale(.8); pointer-events: none; transition: opacity .3s, transform .3s; }
    .top app-icon { transform: rotate(-90deg); }
    .top.show { opacity: 1; transform: none; pointer-events: auto; }
    .top.show:hover { transform: translateY(-5px); }
  `],
})
export class MainLayoutComponent {
  readonly showTop = signal(false);

  @HostListener('window:scroll') onScroll() { this.showTop.set(window.scrollY > 300); }

  toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
