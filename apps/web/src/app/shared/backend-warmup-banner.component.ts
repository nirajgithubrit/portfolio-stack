import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackendStatusService } from '../core/backend-status.service';

@Component({
  selector: 'app-backend-warmup-banner',
  standalone: true,
  template: `
    @if (status.isWarmingUp() && !status.dismissed()) {
      <div class="fixed right-4 top-4 z-[150] max-w-sm rounded-xl border border-cyan-300/30 bg-night-900/95 p-3 text-sm text-cyan-100 shadow-2xl backdrop-blur">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300"></span>
            <span>Server starting up...</span>
          </div>
          <button
            type="button"
            class="rounded px-2 py-1 text-xs text-cyan-200/80 hover:bg-white/10"
            (click)="status.dismissBanner()"
          >
            x
          </button>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackendWarmupBannerComponent {
  readonly status = inject(BackendStatusService);
}
