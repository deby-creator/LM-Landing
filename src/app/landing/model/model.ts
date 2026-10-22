import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';
import { ActionLink } from '../../shared/action-link';

@Component({ selector: 'lm-model', standalone: true, imports: [SectionBar, ActionLink], templateUrl: './model.html', styleUrl: './model.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ModelSection { readonly content = CONTENT.sections.service; }
