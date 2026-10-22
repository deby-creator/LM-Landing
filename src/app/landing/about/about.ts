import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';

@Component({ selector: 'lm-about', standalone: true, imports: [SectionBar], templateUrl: './about.html', styleUrl: './about.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class AboutSection {
  readonly content = CONTENT.sections.quienes;
  readonly video = CONTENT.sections.video.aside;
}
