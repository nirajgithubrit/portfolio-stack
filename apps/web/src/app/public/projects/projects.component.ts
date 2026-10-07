import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import type { Project } from '../../shared/models';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { RevealDirective, TiltDirective } from '../../core/directives';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective, TiltDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="projects" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">Portfolio</span>
          <h2>Featured <span class="gradient-text">projects</span></h2>
          <p>A selection of work I'm proud of. Click any card for details.</p>
        </div>

        <div class="tabs" reveal>
          @for (c of categories(); track c) {
            <button [class.on]="filter() === c" (click)="filter.set(c)">{{ c }}</button>
          }
        </div>

        <div class="grid">
          @for (p of visible(); track p._id) {
            <article class="card project" tilt (click)="selected.set(p)" tabindex="0" (keydown.enter)="selected.set(p)">
              <div class="thumb">
                @if (p.imageUrl) {
                  <img [src]="p.imageUrl" [alt]="p.title" loading="lazy" />
                } @else {
                  <div class="noimg">No image</div>
                }
                @if (p.featured) { <span class="feat">Featured</span> }
                <div class="over"><span class="view">View details <app-icon name="arrow" [size]="16" /></span></div>
              </div>
              <div class="body">
                <small>{{ roleLabel(p) }} · {{ p.status === 'live' ? 'Live' : 'Completed' }}@if (p.duration) { · {{ p.duration }} }</small>
                <h3>{{ p.title }}</h3>
                <p>{{ p.summary }}</p>
                <div class="tags">@for (t of p.techStack.slice(0, 4); track t) { <span>{{ t }}</span> }</div>
              </div>
            </article>
          } @empty {
            <p class="empty">No projects in this category yet.</p>
          }
        </div>
      </div>

      @if (selected(); as p) {
        <div class="modal" (click)="selected.set(null)">
          <div class="dialog card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
            <button class="x" (click)="selected.set(null)" aria-label="Close"><app-icon name="close" /></button>
            @if (p.imageUrl) { <img [src]="p.imageUrl" [alt]="p.title" /> }
            <div class="content">
              <small>{{ roleLabel(p) }} · {{ p.status === 'live' ? 'Live' : 'Completed' }}@if (p.duration) { · {{ p.duration }} }</small>
              <h3>{{ p.title }}</h3>
              <p>{{ p.description || p.summary }}</p>
              <div class="tags">@for (t of p.techStack; track t) { <span>{{ t }}</span> }</div>
              <div class="links">
                @if (p.liveUrl) { <a class="btn primary" [href]="p.liveUrl" target="_blank" rel="noopener noreferrer"><app-icon name="external" [size]="16" /> Live demo</a> }
                @if (p.githubUrl) { <a class="btn ghost" [href]="p.githubUrl" target="_blank" rel="noopener noreferrer"><app-icon name="github" [size]="16" /> Source</a> }
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: .6rem; margin-bottom: 2.5rem; }
    .tabs button { padding: .6rem 1.4rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); color: var(--text); transition: all .3s; }
    .tabs button:hover { border-color: var(--primary); }
    .tabs button.on { background: var(--grad); color: var(--gradient-btn-text); border-color: transparent; box-shadow: var(--glow); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 1.8rem; }
    .project { overflow: hidden; cursor: pointer; animation: pop .55s cubic-bezier(.2,.7,.2,1) both; transform-style: preserve-3d; }
    .project:hover { border-color: var(--primary); box-shadow: var(--shadow), var(--glow); }
    @keyframes pop { from { opacity: 0; transform: scale(.92) translateY(20px); } to { opacity: 1; transform: none; } }
    .thumb { position: relative; aspect-ratio: 16/10; overflow: hidden; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.2,.7,.2,1); }
    .noimg { width: 100%; height: 100%; display: grid; place-items: center; color: var(--muted); background: var(--surface-2); font-size: .9rem; }
    .project:hover img { transform: scale(1.12) rotate(1deg); }
    .feat { position: absolute; top: 14px; left: 14px; padding: .3rem .8rem; border-radius: 999px; background: var(--grad-warm); color: #fff; font-size: .75rem; font-weight: 600; }
    .over { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(0deg, rgba(11,13,23,.85), rgba(11,13,23,.2)); opacity: 0; transition: opacity .35s; }
    .project:hover .over { opacity: 1; }
    .view { display: inline-flex; gap: .5rem; align-items: center; color: #fff; font-weight: 600; transform: translateY(14px); transition: transform .35s; }
    .project:hover .view { transform: none; }
    .body { padding: 1.5rem; }
    small { color: var(--accent); font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: .72rem; }
    .body h3 { font-size: 1.3rem; margin: .4rem 0; }
    .body p { color: var(--muted); font-size: .93rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .tags { display: flex; flex-wrap: wrap; gap: .45rem; }
    .tags span { padding: .25rem .7rem; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); font-size: .75rem; color: var(--muted); }
    .empty { grid-column: 1/-1; text-align: center; color: var(--muted); }
    .modal { position: fixed; inset: 0; z-index: 200; background: var(--modal-backdrop); backdrop-filter: blur(8px); display: grid; place-items: center; padding: 1.5rem; animation: fade .3s; overflow-y: auto; }
    .dialog { width: min(760px, 100%); overflow: hidden; background: var(--surface-elevated); animation: zoom .4s cubic-bezier(.2,.7,.2,1); position: relative; }
    .dialog img { width: 100%; aspect-ratio: 16/8; object-fit: cover; }
    .content { padding: 2rem; display: grid; gap: .9rem; }
    .content h3 { font-size: 1.8rem; }
    .content p { color: var(--muted); }
    .links { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: .6rem; }
    .x { position: absolute; top: 14px; right: 14px; z-index: 2; width: 40px; height: 40px; border-radius: 50%; border: 0; background: rgba(0,0,0,.55); color: #fff; display: grid; place-items: center; transition: transform .3s; }
    .x:hover { transform: rotate(90deg); }
    @keyframes fade { from { opacity: 0; } }
    @keyframes zoom { from { opacity: 0; transform: scale(.88) translateY(30px); } }
  `],
})
export class ProjectsComponent {
  private readonly projects = inject(PortfolioDataService).projects;

  readonly filter = signal('All');
  readonly selected = signal<Project | null>(null);
  readonly categories = computed(() => ['All', ...new Set(this.projects().map((p) => this.roleLabel(p)))]);
  readonly visible = computed(() => this.projects().filter((p) => this.filter() === 'All' || this.roleLabel(p) === this.filter()));

  roleLabel(p: Project): string { return p.role === 'fullstack' ? 'Full Stack' : 'Frontend'; }

  @HostListener('document:keydown.escape') close() { this.selected.set(null); }
}
