import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTENT } from '../../content/content';
import { NavigationState } from '../navigation-state';

@Component({
  selector: 'lm-site-header', standalone: true, imports: [RouterLink],
  templateUrl: './site-header.html', styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeader {
  readonly content = CONTENT.header;
  readonly links = this.content.links.filter(link => link.target !== 'video');
  readonly navigation = inject(NavigationState);
  readonly menuOpen = signal(false);
  @HostListener('document:keydown.escape') closeMenu(): void { this.menuOpen.set(false); }
}
