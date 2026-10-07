import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteSettingsService } from '../../core/site-settings.service';
import { HeroComponent } from './hero.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, ExperienceComponent, ContactComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (settings(); as s) {
      <app-hero [settings]="s" />
      <app-about [settings]="s" />
      <app-skills />
      <app-projects />
      <app-experience />
      <app-contact [settings]="s" />
    } @else {
      <div class="state"><div class="loader"></div></div>
    }
  `,
  styles: [`
    .state { min-height: 100vh; display: grid; place-content: center; }
    .loader { width: 56px; height: 56px; border-radius: 50%; border: 4px solid var(--surface-2); border-top-color: var(--primary); border-right-color: var(--accent); animation: spin 0.9s linear infinite; }
  `],
})
export class HomeComponent {
  readonly settings = toSignal(inject(SiteSettingsService).settings$, { initialValue: null });
}
