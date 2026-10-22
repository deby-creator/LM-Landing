import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './shared/site-header/site-header';

@Component({
  selector: 'lm-root', standalone: true, imports: [RouterOutlet, SiteHeader],
  template: '<lm-site-header /><main id="contenido"><router-outlet /></main>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
