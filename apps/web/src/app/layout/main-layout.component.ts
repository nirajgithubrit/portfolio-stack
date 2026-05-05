import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeAnim', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class MainLayoutComponent {
  prepareRoute(outlet: RouterOutlet): string {
    if (!outlet || !outlet.isActivated) return 'none';
    return outlet.activatedRoute.snapshot.data['animation'] ?? 'none';
  }
}
