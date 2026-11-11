import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';

@Component({ selector: 'lm-benefits', standalone: true, imports: [SectionBar], templateUrl: './benefits.html', styleUrl: './benefits.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class BenefitsSection {
  readonly content = CONTENT.sections.beneficios;
  readonly active = signal(0);
  readonly artwork = ['benefit-fuel-depot.jpg.jpeg', 'benefit-automotive-station.png', 'benefit-technology-station.png', 'benefit-support-germany.png'];
  readonly markerIcons: string[] = ['icon-fuel-truck.png', 'benefit-icon-automotive.svg', 'benefit-icon-technology.svg', 'benefit-icon-support.svg'];
  onToggle(index: number, event: Event): void {
    if ((event.target as HTMLDetailsElement).open) this.active.set(index);
  }
}
