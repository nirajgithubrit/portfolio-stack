import { computed, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'portfolio_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** JWT for admin API calls (localStorage survives refresh; use sessionStorage if you prefer tab-only). */
  readonly token = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.token.set(localStorage.getItem(STORAGE_KEY));
    }
  }

  setToken(t: string | null): void {
    this.token.set(t);
    if (typeof localStorage === 'undefined') return;
    if (t) localStorage.setItem(STORAGE_KEY, t);
    else localStorage.removeItem(STORAGE_KEY);
  }

  logout(): void {
    this.setToken(null);
  }
}
