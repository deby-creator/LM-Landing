import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Metric } from '../content/content';

@Component({
  selector: 'lm-metrics', standalone: true,
  template: `
    <div class="metrics" [class.metrics--compact]="compact()">
      @for (metric of items(); track metric.label; let i = $index) {
        <div class="metric">
          @if (!compact()) { <img [src]="icons[i]" alt="" width="93" height="93" loading="lazy"> }
          <div><b>{{ metric.value }}</b><span>{{ metric.label }}</span></div>
        </div>
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Metrics {
  readonly items = input.required<Metric[]>();
  readonly compact = input(false);
  readonly icons = ['assets/icon-global.png', 'assets/icon-mexico.png', 'assets/icon-made-in-germany.png'];
}
