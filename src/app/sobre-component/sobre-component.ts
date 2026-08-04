import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { LanguageService } from '../core/i18n/language.service';
import { SeoService } from '../core/i18n/seo.service';
import { translate } from '../core/i18n/translations';

@Component({
  selector: 'app-sobre-component',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './sobre-component.html',
  styleUrl: './sobre-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SobreComponent implements OnInit {
  constructor(public languageService: LanguageService, private seo: SeoService) {}

  ngOnInit(): void {
    const lang = this.languageService.lang();
    this.seo.set({
      title: translate('seo.sobre.title', lang),
      description: translate('seo.sobre.description', lang),
      path: '/sobre',
      lang,
    });
  }
}
