import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from '../core/models/certificate.model';
import { CertificatesService } from '../core/services/certificates.service';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { LanguageService } from '../core/i18n/language.service';
import { extractLang } from '../core/i18n/multilang';
import { SeoService } from '../core/i18n/seo.service';
import { translate } from '../core/i18n/translations';

@Component({
  selector: 'app-certificado-component',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './certificado-component.html',
  styleUrl: './certificado-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CertificadoComponent implements OnInit {
  certificates = signal<Certificate[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(
    private certificatesService: CertificatesService,
    private languageService: LanguageService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    const lang = this.languageService.lang();
    this.seo.set({
      title: translate('seo.certificados.title', lang),
      description: translate('seo.certificados.description', lang),
      path: '/certificados',
      lang,
    });

    this.certificatesService.getAll().subscribe({
      next: (data) => {
        this.certificates.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  text(raw: string): string {
    return extractLang(raw, this.languageService.lang());
  }
}
