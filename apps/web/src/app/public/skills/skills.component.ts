import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { RevealDirective } from '../../core/directives';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="section alt">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">Skills</span>
          <h2>Tech I <span class="gradient-text">work with</span></h2>
          <p>Tools and technologies I use to bring products from idea to production.</p>
        </div>

        <div class="tabs" reveal>
          @for (c of categories(); track c) {
            <button [class.on]="active() === c" (click)="active.set(c)">{{ c }}</button>
          }
        </div>

        <div class="grid">
          @for (s of visible(); track s._id) {
            <div class="card skill" reveal [revealDelay]="$index * 70">
              <div class="row"><b>{{ s.name }}</b><span>{{ s.proficiency }}%</span></div>
              <div class="track"><div class="fill" [style.--w]="s.proficiency + '%'"></div></div>
            </div>
          }
        </div>

        @if (skills().length) {
          <div class="marquee" aria-hidden="true">
            <div class="belt">
              @for (n of marquee(); track $index) { <span>{{ n }}</span> }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .alt { background: linear-gradient(180deg, transparent, var(--surface), transparent); }
    .tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: .6rem; margin-bottom: 2.5rem; }
    .tabs button { padding: .6rem 1.4rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); color: var(--text); transition: all .3s; }
    .tabs button:hover { border-color: var(--primary); }
    .tabs button.on { background: var(--grad); color: var(--gradient-btn-text); border-color: transparent; box-shadow: var(--glow); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
    .skill { padding: 1.4rem 1.6rem; }
    .skill:hover { border-color: var(--primary); box-shadow: var(--glow); }
    .row { display: flex; justify-content: space-between; margin-bottom: .8rem; }
    .row span { color: var(--accent); font-weight: 600; }
    .track { height: 8px; border-radius: 8px; background: var(--progress-track); overflow: hidden; }
    .fill { height: 100%; width: 0; border-radius: 8px; background: var(--grad); position: relative; }
    .skill.in .fill { animation: grow 1.4s .2s cubic-bezier(.2,.7,.2,1) forwards; }
    .fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent); animation: sweep 2.4s 1.4s infinite; }
    @keyframes grow { to { width: var(--w); } }
    @keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    .marquee { margin-top: 4rem; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); }
    .belt { display: flex; gap: 3rem; width: max-content; animation: scroll 30s linear infinite; }
    .belt span { font: 700 clamp(1.6rem, 3vw, 2.4rem) 'Space Grotesk'; color: transparent; -webkit-text-stroke: 1px var(--muted); white-space: nowrap; }
    .belt span:hover { color: var(--primary); -webkit-text-stroke-color: var(--primary); }
    @keyframes scroll { to { transform: translateX(-50%); } }
  `],
})
export class SkillsComponent {
  readonly skills = inject(PortfolioDataService).skills;

  readonly active = signal('All');
  readonly categories = computed(() => ['All', ...new Set(this.skills().map((s) => s.category || 'General'))]);
  readonly visible = computed(() => this.skills().filter((s) => this.active() === 'All' || (s.category || 'General') === this.active()));
  // Duplicated so the CSS translateX(-50%) loop is seamless
  readonly marquee = computed(() => { const n = this.skills().map((s) => s.name); return [...n, ...n]; });
}
