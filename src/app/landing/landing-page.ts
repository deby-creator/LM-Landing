import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroSection } from './hero/hero';
import { BrandSection } from './brand/brand';
import { AboutSection } from './about/about';
import { ModelSection } from './model/model';
import { BenefitsSection } from './benefits/benefits';
import { ContactSection } from './contact/contact';

@Component({
  selector: 'lm-landing-page', standalone: true,
  imports: [HeroSection, BrandSection, AboutSection, ModelSection, BenefitsSection, ContactSection],
  template: '<lm-hero /><lm-brand /><lm-about /><lm-model /><lm-benefits /><lm-contact />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPage {}
