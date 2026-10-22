import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lm-disclosure', standalone: true,
  template: '<details class="disclosure" [open]="expanded()"><summary>{{ title() }}<span class="disclosure__indicator" aria-hidden="true"></span></summary><div class="disclosure__body"><ng-content /></div></details>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Disclosure {
  readonly title = input.required<string>();
  readonly expanded = input(false);
}
