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
  readonly billingOpen = signal(false);
  readonly flotillasOpen = signal(false);
  readonly selectedFlotilla = signal<'palomar' | 'santa-lucia'>('palomar');
  get flotillaContent() {
    return this.selectedFlotilla() === 'palomar'
      ? { station: 'EL PALOMAR', note: '* Crédito sujeto a evaluación comercial.', contact: { phone: '777 365 6959', phoneHref: '7773656959', addressFirst: 'Carr. a Aeropuerto de Cuernavaca Km 0 200, Local 13 y 14', addressSecond: 'Fracc. Los Sabinos, 62790 Xochitepec, Morelos' }, items: [
          { icon: '◉', title: 'Calidad', lines: ['Diésel de ultrabajo azufre (UBA)', 'Verificación antes de descargar', 'Reportes de calidad disponibles'] },
          { icon: '◎', title: 'Control', lines: ['Tickets personalizados y bitácoras', 'Consulta de cargas por internet', 'Videovigilancia 24 horas'] },
          { icon: '◷', title: 'Atención', lines: ['Servicio personalizado 24 horas', 'Personal capacitado', 'Asesoría para tu flotilla'] },
          { icon: '▤', title: 'Administración', lines: ['Facturación en línea', 'Estados de cuenta automáticos', 'Opciones de crédito*'] }
        ] }
      : { station: 'SANTA LUCÍA', note: '* Crédito sujeto a evaluación comercial.  ·  Carga eléctrica disponible.', contact: { phone: '442 628 8001', phoneHref: '4426288001', addressFirst: 'Carretera San Juan del Río-Amealco', addressSecond: '76828 Santa Lucía, Querétaro' }, items: [
          { icon: '◉', title: 'Calidad', lines: ['Diésel de ultrabajo azufre (UBA)', 'Verificación antes de descargar'] },
          { icon: '◎', title: 'Control', lines: ['Tickets personalizados y bitácoras', 'Videovigilancia en estación'] },
          { icon: '◷', title: 'Atención', lines: ['Servicio personalizado', 'Personal capacitado', 'Asesoría para tu flotilla'] },
          { icon: '▤', title: 'Administración', lines: ['Facturación en línea', 'Estados de cuenta automáticos', 'Opciones de crédito*'] }
        ] };
  }

  openBillingModal(): void {
    this.menuOpen.set(false);
    this.billingOpen.set(true);
  }

  closeBillingModal(): void { this.billingOpen.set(false); }

  openFlotillasModal(): void {
    this.menuOpen.set(false);
    this.selectedFlotilla.set('palomar');
    this.flotillasOpen.set(true);
  }

  closeFlotillasModal(): void { this.flotillasOpen.set(false); }

  submitFleetInquiry(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    const body = [
      `Nombre: ${values.get('name')}`,
      `Empresa: ${values.get('company')}`,
      `Ciudad: ${values.get('city')}`,
      `Teléfono: ${values.get('phone')}`,
      `Correo: ${values.get('email')}`,
    ].join('\n');
    window.location.href = `mailto:atencion.calidad@liqui-moly.mx?subject=${encodeURIComponent('Solicitud de información para flotillas')}&body=${encodeURIComponent(body)}`;
  }

  @HostListener('document:keydown.escape') closeMenu(): void {
    this.menuOpen.set(false);
    this.billingOpen.set(false);
    this.flotillasOpen.set(false);
  }
}
