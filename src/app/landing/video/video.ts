import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';
import { SectionTransition } from '../../shared/transition';

@Component({ selector: 'lm-video', standalone: true, imports: [SectionBar, SectionTransition], templateUrl: './video.html', styleUrl: './video.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class VideoSection { readonly content = CONTENT.sections.video; }
