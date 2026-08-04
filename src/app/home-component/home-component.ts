import { Component, OnInit } from '@angular/core';
import { ApresentacaoPortifolio } from '../apresentacao-portifolio/apresentacao-portifolio';
import { GithubShowcaseComponent } from '../github-showcase/github-showcase';
import { SeoService } from '../core/i18n/seo.service';
import { LanguageService } from '../core/i18n/language.service';
import { translate } from '../core/i18n/translations';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [ApresentacaoPortifolio, GithubShowcaseComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
  constructor(private seo: SeoService, private languageService: LanguageService) {}

  ngOnInit(): void {
    const lang = this.languageService.lang();
    this.seo.set({
      title: translate('seo.home.title', lang),
      description: translate('seo.home.description', lang),
      path: '/home',
      lang,
    });
  }
}
