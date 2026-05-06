import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/seo.service';
import { ThemeService } from './core/theme.service';
import { BackendWarmupBannerComponent } from './shared/backend-warmup-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BackendWarmupBannerComponent],
  template: `
    <router-outlet />
    <app-backend-warmup-banner />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly theme = inject(ThemeService);
  private readonly viewportScroller = inject(ViewportScroller);

  ngOnInit(): void {
    this.viewportScroller.setOffset([0, 96]);
    this.theme.init();
    this.seo.init('Nirajkumar Satani · Full Stack Developer');
  }
}
