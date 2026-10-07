import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, computed, inject, signal } from '@angular/core';
import type { SiteSettings } from '../../shared/models';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="home" class="hero">
      <div class="blob b1"></div>
      <div class="blob b2"></div>

      <div class="container grid">
        <div class="copy">
          <span class="badge"><i class="dot"></i> Open for full-time roles &amp; freelance</span>
          <p class="hi">Hi, I'm</p>
          <h1><span class="gradient-text">{{ settings.fullName }}</span></h1>
          <h2 class="typed">{{ typed() }}<span class="caret">|</span></h2>
          <p class="tagline">{{ settings.aboutSummary }}</p>
          @if (settings.locationLabel) {
            <p class="loc"><app-icon name="pin" [size]="16" /> {{ settings.locationLabel }}</p>
          }

          <div class="cta">
            <a class="btn primary" href="#contact" (click)="scroll($event, 'contact')">Hire me <app-icon name="arrow" [size]="18" /></a>
            <a class="btn ghost" href="#projects" (click)="scroll($event, 'projects')">View my work</a>
            <a class="btn ghost" [href]="settings.resumeUrl || '/resume.pdf'" download><app-icon name="download" [size]="18" /> Resume</a>
          </div>

          <div class="socials">
            @for (s of settings.socials; track s.url) {
              <a [href]="s.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="s.platform" [title]="s.platform">
                @if (has(s.icon)) { <app-icon [name]="s.icon!.toLowerCase()" /> } @else { <span class="txt">{{ s.platform.slice(0, 2) }}</span> }
              </a>
            }
          </div>
        </div>

        <div class="visual">
          <div class="orbit"></div>
          <div class="orbit o2"></div>
          <img class="avatar" [src]="settings.profilePhotoUrl || '/profile.png'" [alt]="settings.fullName + ' profile photo'" />
          @for (c of chips(); track c.name; let i = $index) {
            <div class="chip" [class]="'chip c' + (i + 1)"><app-icon [name]="c.icon" [size]="18" /> {{ c.name }}</div>
          }
        </div>
      </div>

      <a class="scroll-hint" href="#about" (click)="scroll($event, 'about')" aria-label="Scroll down">
        <span class="mouse"><i></i></span>
      </a>
    </section>
  `,
  styles: [`
    .hero { min-height: 100vh; display: flex; align-items: center; padding: 8rem 0 5rem; position: relative; overflow: hidden; }
    .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .45; animation: float 9s ease-in-out infinite; }
    .b1 { width: 420px; height: 420px; background: var(--accent-2); top: -80px; left: -100px; }
    .b2 { width: 360px; height: 360px; background: var(--accent); bottom: -60px; right: -80px; animation-delay: -4s; }
    .grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 3rem; align-items: center; position: relative; z-index: 2; }
    .copy > * { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
    .copy > :nth-child(2) { animation-delay: .1s; } .copy > :nth-child(3) { animation-delay: .2s; }
    .copy > :nth-child(4) { animation-delay: .3s; } .copy > :nth-child(5) { animation-delay: .4s; }
    .copy > :nth-child(6) { animation-delay: .5s; } .copy > :nth-child(7) { animation-delay: .6s; }
    .copy > :nth-child(8) { animation-delay: .7s; }
    .badge { display: inline-flex; align-items: center; gap: .6rem; padding: .45rem 1rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); font-size: .85rem; margin-bottom: 1.5rem; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #2ee59d; position: relative; }
    .dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #2ee59d; animation: pulse 1.8s infinite; }
    .hi { color: var(--muted); font-size: 1.2rem; }
    h1 { font-size: clamp(2.8rem, 7vw, 5.2rem); line-height: 1.1; margin: .2rem 0 .6rem; letter-spacing: -.02em; }
    .typed { font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 500; min-height: 2.4rem; color: var(--text); }
    .caret { color: var(--accent); animation: blink 1s steps(1) infinite; margin-left: 2px; }
    .tagline { color: var(--muted); font-size: 1.1rem; max-width: 520px; margin: 1rem 0 1rem; }
    .loc { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); font-size: .92rem; margin-bottom: 1.6rem; }
    .loc app-icon { color: var(--accent); }
    .cta { display: flex; flex-wrap: wrap; gap: 1rem; }
    .socials { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 2.2rem; }
    .socials a { width: 46px; height: 46px; border-radius: 14px; border: 1px solid var(--border); background: var(--surface); display: grid; place-items: center; transition: all .3s; }
    .socials a:hover { transform: translateY(-6px); background: var(--grad); border-color: transparent; color: var(--gradient-btn-text); box-shadow: var(--glow); }
    .txt { font-size: .8rem; font-weight: 700; text-transform: uppercase; }

    .visual { position: relative; display: grid; place-items: center; animation: rise 1s .3s both; }
    .avatar { width: min(380px, 80%); aspect-ratio: 1; object-fit: cover; border-radius: 50%; border: 6px solid var(--bg-2); box-shadow: var(--shadow), var(--glow); position: relative; z-index: 2; animation: float 7s ease-in-out infinite; }
    .orbit { position: absolute; width: min(470px, 100%); aspect-ratio: 1; border-radius: 50%; border: 2px dashed var(--primary); opacity: .5; animation: spin 24s linear infinite; }
    .orbit.o2 { width: min(540px, 115%); border-color: var(--accent); animation-duration: 38s; animation-direction: reverse; opacity: .3; }
    .chip { position: absolute; z-index: 3; display: flex; align-items: center; gap: .5rem; padding: .6rem 1rem; border-radius: 14px; background: var(--surface-elevated); border: 1px solid var(--border); backdrop-filter: blur(12px); font-size: .85rem; font-weight: 600; box-shadow: var(--shadow); animation: float 6s ease-in-out infinite; }
    .c1 { top: 8%; left: 2%; } .c2 { top: 45%; right: -2%; animation-delay: -2s; } .c3 { bottom: 6%; left: 10%; animation-delay: -4s; }
    .scroll-hint { position: absolute; bottom: 1.8rem; left: 50%; transform: translateX(-50%); z-index: 2; }
    .mouse { width: 26px; height: 42px; border: 2px solid var(--muted); border-radius: 14px; display: block; position: relative; }
    .mouse i { position: absolute; top: 8px; left: 50%; width: 4px; height: 8px; margin-left: -2px; border-radius: 2px; background: var(--accent); animation: wheel 1.6s infinite; }

    @keyframes rise { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: none; } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes wheel { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(14px); } }
    @media (max-width: 880px) {
      .grid { grid-template-columns: 1fr; text-align: center; }
      .cta, .socials { justify-content: center; }
      .tagline { margin-inline: auto; }
      .visual { order: -1; }
      .avatar { width: min(260px, 70%); }
      .orbit { width: min(330px, 100%); }
      .orbit.o2 { width: min(380px, 112%); }
      .chip { display: none; }
      .scroll-hint { display: none; }
    }
  `],
})
export class HeroComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) settings!: SiteSettings;
  private readonly data = inject(PortfolioDataService);

  readonly typed = signal('');
  /** Floating chips show the three strongest skills from the API. */
  readonly chips = computed(() => {
    const icons = ['code', 'server', 'rocket'];
    return [...this.data.skills()]
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 3)
      .map((s, i) => ({ name: s.name, icon: icons[i] }));
  });
  private timer?: ReturnType<typeof setTimeout>;

  ngOnChanges(c: SimpleChanges) {
    if (c['settings']) this.startTyping();
  }

  ngOnDestroy() { clearTimeout(this.timer); }

  has = (n?: string) => IconComponent.has((n ?? '').toLowerCase());

  scroll(e: Event, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private startTyping() {
    clearTimeout(this.timer);
    const roles = [this.settings.headline, ...(this.settings.taglineLines ?? [])].filter(Boolean);
    if (!roles.length) { this.typed.set(''); return; }
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r % roles.length];
      i += deleting ? -1 : 1;
      this.typed.set(word.slice(0, i));
      let delay = deleting ? 40 : 85;
      if (!deleting && i === word.length) { deleting = true; delay = 1600; }
      else if (deleting && i === 0) { deleting = false; r++; delay = 400; }
      this.timer = setTimeout(tick, delay);
    };
    tick();
  }
}
