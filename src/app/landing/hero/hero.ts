import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { ActionLink } from '../../shared/action-link';
import { Metrics } from '../../shared/metrics';

@Component({
  selector: 'lm-hero', standalone: true, imports: [ActionLink, Metrics],
  templateUrl: './hero.html', styleUrl: './hero.scss', changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSection { readonly content = CONTENT.hero; }
