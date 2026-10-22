import { afterNextRender, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationState {
  readonly active = signal('inicio');
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  private readonly viewport = inject(ViewportScroller);

  constructor() {
    this.viewport.setOffset(() => [0, this.document.querySelector('header')?.getBoundingClientRect().height ?? 88]);
    afterNextRender(() => {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) this.active.set(entry.target.id);
      }, { rootMargin: '-18% 0px -55% 0px' });
      this.document.querySelectorAll('section[data-section]').forEach(section => observer.observe(section));
      const subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) this.document.getElementById(fragment)?.focus({ preventScroll: true });
      });
      this.destroy.onDestroy(() => { observer.disconnect(); subscription.unsubscribe(); });
    });
  }
}
