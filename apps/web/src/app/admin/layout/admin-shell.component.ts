import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/site-settings', label: 'Site Settings' },
    { path: '/admin/projects', label: 'Projects' },
    { path: '/admin/skills', label: 'Skills' },
    { path: '/admin/experience', label: 'Experience' },
    { path: '/admin/messages', label: 'Messages' },
  ] as const;

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login');
  }
}
