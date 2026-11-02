import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';

@Component({ selector: 'lm-brand', standalone: true, imports: [SectionBar], templateUrl: './brand.html', styleUrl: './brand.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class BrandSection {
  readonly content = CONTENT.sections.respaldo;
  readonly icons = ['brand-icon-international.svg', 'brand-icon-trajectory.svg', 'brand-icon-performance.svg'];
}
