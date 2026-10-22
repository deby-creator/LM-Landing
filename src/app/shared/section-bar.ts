import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionContent } from '../content/content';

@Component({
  selector: 'lm-section-bar', standalone: true, imports: [RouterLink],
  template: '<div class="section-bar"><span class="eyebrow">{{ section().label }}</span><a routerLink="/" fragment="inicio">{{ section().back }}</a></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionBar { readonly section = input.required<SectionContent>(); }
