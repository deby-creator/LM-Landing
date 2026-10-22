import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTENT } from '../../content/content';
import { SectionBar } from '../../shared/section-bar';

@Component({ selector: 'lm-contact', standalone: true, imports: [SectionBar], templateUrl: './contact.html', styleUrl: './contact.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ContactSection {
  readonly content = CONTENT.sections.contacto;

  // No delivery address or endpoint has been provided yet. Prevent Enter from
  // submitting to the current page while the visible submit button is disabled.
  preventUnconfiguredSubmit(event: Event): void { event.preventDefault(); }
}
