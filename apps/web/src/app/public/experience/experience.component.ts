import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { RevealDirective } from '../../core/directives';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items().length) {
      <section id="experience" class="section alt">
        <div class="container">
          <div class="section-head" reveal>
            <span class="eyebrow">Journey</span>
            <h2>Work <span class="gradient-text">experience</span></h2>
          </div>

          <div class="timeline">
            @for (e of items(); track e._id; let i = $index) {
              <div class="item" [class.right]="i % 2" [reveal]="i % 2 ? 'right' : 'left'">
                <span class="node"></span>
                <div class="card box">
                  <span class="period">
                    {{ e.startDate | date: 'MMM yyyy' }} — {{ e.endDate ? (e.endDate | date: 'MMM yyyy') : 'Present' }}
                  </span>
                  <h3>{{ e.title }}</h3>
                  <b class="org">{{ e.company }} @if (e.location) { <em>{{ e.location }}</em> }</b>
                  <p>{{ e.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .alt { background: linear-gradient(180deg, transparent, var(--surface), transparent); }
    .timeline { position: relative; max-width: 940px; margin: auto; }
    .timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(var(--primary), var(--accent), transparent); transform: translateX(-1px); }
    .item { position: relative; width: 50%; padding: 0 3rem 3rem 0; }
    .item.right { margin-left: 50%; padding: 0 0 3rem 3rem; }
    .node { position: absolute; top: 1.6rem; right: -9px; width: 18px; height: 18px; border-radius: 50%; background: var(--bg); border: 3px solid var(--accent); box-shadow: 0 0 0 6px var(--accent-soft); z-index: 1; }
    .item.right .node { right: auto; left: -9px; }
    .box { padding: 1.7rem; }
    .box:hover { border-color: var(--primary); box-shadow: var(--glow); }
    .period { display: inline-block; padding: .25rem .8rem; border-radius: 999px; background: var(--grad); color: var(--gradient-btn-text); font-size: .78rem; font-weight: 600; margin-bottom: .8rem; }
    h3 { font-size: 1.25rem; }
    .org { display: block; color: var(--accent); margin: .3rem 0 .7rem; font-weight: 600; }
    .org em { font-style: normal; font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-left: .5rem; padding: .1rem .5rem; border: 1px solid var(--border); border-radius: 6px; }
    p { color: var(--muted); font-size: .95rem; }
    @media (max-width: 760px) {
      .timeline::before { left: 8px; }
      .item, .item.right { width: 100%; margin: 0; padding: 0 0 2rem 2.5rem; }
      .node, .item.right .node { left: 0; right: auto; }
    }
  `],
})
export class ExperienceComponent {
  readonly items = inject(PortfolioDataService).experience;
}
