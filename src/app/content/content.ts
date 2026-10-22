import source from './content.generated.json';

export interface Action { label: string; target: string; }
export interface Feature { title: string; description: string; marker?: string; }
export interface Metric { value: string; label: string; }
export interface AsideContent {
  label: string; title: string; description: string; metrics: Metric[];
  tags: string[]; features: Feature[]; play: string;
}
export interface SectionContent {
  id: string; back: string; label: string; kicker: string; title: string; lead: string;
  features: Feature[]; pillars: Feature[]; benefits: (Feature & { number: string })[];
  tags: string[]; transition: Feature & { action: Action }; aside: AsideContent | null;
}
export interface LandingContent {
  header: { brand: string[]; links: Action[] };
  hero: {
    badge: string; title: string[]; tagline: string; description: string;
    actions: Action[]; metrics: Metric[]; explanation: Feature & { features: Feature[] };
    index: (Action & Feature & { number: string })[]; footnote: string;
  };
  sections: Record<'respaldo' | 'quienes' | 'service' | 'beneficios' | 'video' | 'contacto', SectionContent>;
}
export const CONTENT: LandingContent = source;
