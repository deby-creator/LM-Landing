import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';

@Component({ selector: 'lm-benefits', standalone: true, imports: [SectionBar], templateUrl: './benefits.html', styleUrl: './benefits.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class BenefitsSection {
  readonly content = CONTENT.sections.beneficios;
  readonly active = signal(0);
  readonly artwork = ['icon-fuel-truck.png', 'quality-box.png', 'app-mobile-screens@2x.png', 'icon-handshake.png'];
  onToggle(index: number, event: Event): void {
    if ((event.target as HTMLDetailsElement).open) this.active.set(index);
  }
}
