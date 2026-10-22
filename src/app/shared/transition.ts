import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectionContent } from '../content/content';
import { ActionLink } from './action-link';
import { Disclosure } from './disclosure';

@Component({
  selector: 'lm-transition', standalone: true, imports: [ActionLink, Disclosure],
  template: '<div class="section-transition"><lm-disclosure [title]="content().title"><p>{{ content().description }}</p></lm-disclosure><lm-action [action]="content().action" variant="outline" /></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionTransition { readonly content = input.required<SectionContent['transition']>(); }
