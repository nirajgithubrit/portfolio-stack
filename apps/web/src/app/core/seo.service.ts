import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  init(defaultTitle: string): void {
    const apply = (): void => {
      let child = this.route.firstChild;
      while (child?.firstChild) child = child.firstChild;
      const data = child?.snapshot.data as { title?: string; description?: string } | undefined;
      const title = data?.title ? `${data.title} · Nirajkumar Satani` : defaultTitle;
      this.title.setTitle(title);
      const desc =
        data?.description ??
        'Nirajkumar Satani — full-stack developer portfolio, projects, and contact.';
      this.meta.updateTag({ name: 'description', content: desc });
    };
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(apply);
    queueMicrotask(() => apply());
  }
}
