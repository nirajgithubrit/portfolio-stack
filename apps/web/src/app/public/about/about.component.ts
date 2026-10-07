import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import type { SiteSettings } from '../../shared/models';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { CountToDirective, RevealDirective } from '../../core/directives';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, CountToDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">About me</span>
          <h2>Crafting <span class="gradient-text">digital experiences</span></h2>
        </div>

        <div class="split">
          <div class="photo" reveal="left">
            <img [src]="settings.profilePhotoUrl || '/profile.png'" [alt]="settings.fullName" loading="lazy" />
            <div class="frame"></div>
          </div>

          <div reveal="right">
            <h3>{{ settings.headline }}</h3>
            <p class="bio">{{ settings.aboutSummary }}</p>
            <ul class="info">
              @if (settings.contactEmail) { <li><app-icon name="mail" [size]="18" /> <a [href]="'mailto:' + settings.contactEmail">{{ settings.contactEmail }}</a></li> }
              @if (settings.phone) { <li><app-icon name="phone" [size]="18" /> {{ settings.phone }}</li> }
              @if (settings.locationLabel) { <li><app-icon name="pin" [size]="18" /> {{ settings.locationLabel }}</li> }
            </ul>
            @if (settings.heroStats.length) {
              <div class="pills">
                @for (s of settings.heroStats; track s) { <span>{{ s }}</span> }
              </div>
            }
          </div>
        </div>

        <div class="stats">
          @for (s of stats(); track s.label; let i = $index) {
            <div class="card stat" reveal="zoom" [revealDelay]="i * 100">
              <b class="gradient-text" [countTo]="s.value" [suffix]="s.suffix"></b>
              <span>{{ s.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .split { display: grid; grid-template-columns: 1fr 1.3fr; gap: 4rem; align-items: center; }
    .photo { position: relative; max-width: 380px; margin-inline: auto; }
    .photo img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 28px; position: relative; z-index: 1; box-shadow: var(--shadow); }
    .frame { position: absolute; inset: 0; border-radius: 28px; background: var(--grad); transform: translate(18px, 18px); opacity: .6; transition: transform .5s; }
    .photo:hover .frame { transform: translate(28px, 28px); }
    h3 { font-size: 1.8rem; line-height: 1.2; margin-bottom: 1rem; }
    .bio { color: var(--muted); font-size: 1.05rem; margin-bottom: 1.5rem; }
    .info { list-style: none; padding: 0; margin: 0; display: grid; gap: .7rem; }
    .info li { display: flex; align-items: center; gap: .8rem; color: var(--muted); }
    .info app-icon { color: var(--accent); }
    .info a:hover { color: var(--text); }
    .pills { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.5rem; }
    .pills span { padding: .3rem .8rem; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); font-size: .8rem; color: var(--muted); }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1.2rem; margin-top: 5rem; }
    .stat { padding: 2rem 1rem; text-align: center; }
    .stat:hover { border-color: var(--primary); box-shadow: var(--glow); }
    .stat b { display: block; font: 700 clamp(2.2rem, 4vw, 3rem) 'Space Grotesk'; }
    .stat span { color: var(--muted); font-size: .9rem; }
    @media (max-width: 820px) { .split { grid-template-columns: 1fr; gap: 2.5rem; } }
  `],
})
export class AboutComponent {
  @Input({ required: true }) settings!: SiteSettings;
  private readonly data = inject(PortfolioDataService);

  readonly stats = computed(() => {
    const m = this.data.metrics();
    return [
      ...(m.years > 0 ? [{ label: 'Years experience', value: m.years, suffix: '+' }] : []),
      { label: 'Production projects', value: m.projectCount, suffix: '' },
      { label: 'Shipped features', value: m.featuredCount, suffix: '' },
    ];
  });
}
