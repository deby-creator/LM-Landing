import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Action } from '../content/content';

@Component({
  selector: 'lm-action', standalone: true, imports: [RouterLink],
  template: '<a [routerLink]="\'/\'" [fragment]="action().target" class="action" [class.action--outline]="variant() === \'outline\'">{{ action().label }}</a>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionLink {
  readonly action = input.required<Action>();
  readonly variant = input<'solid' | 'outline'>('solid');
}
