import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  readonly isWarmingUp = signal(false);
  readonly dismissed = signal(false);
  private polling = false;
  private pollSub?: Subscription;

  constructor(private readonly http: HttpClient) {}

  notifyPossibleWarmup(): void {
    this.isWarmingUp.set(true);
    this.dismissed.set(false);
    this.startPolling();
  }

  dismissBanner(): void {
    this.dismissed.set(true);
  }

  private startPolling(): void {
    if (this.polling) return;
    this.polling = true;
    this.pollSub = timer(0, 3000)
      .pipe(switchMap(() => this.http.get('/api/health')))
      .subscribe({
        next: () => {
          this.isWarmingUp.set(false);
          this.dismissed.set(false);
          this.polling = false;
          this.pollSub?.unsubscribe();
          this.pollSub = undefined;
        },
        error: () => {
          // keep polling until backend is healthy
        },
      });
  }
}
