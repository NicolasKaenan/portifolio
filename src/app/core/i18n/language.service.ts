import { Injectable, signal, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Lang } from './multilang';

/**
 * O idioma do site agora é uma propriedade da URL (/en/... = inglês,
 * raiz = português), não só uma preferência guardada localmente. Isso
 * é o que permite o Google indexar as duas versões como páginas
 * separadas em vez de uma escondida atrás de JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  lang = signal<Lang>('pt');

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.updateFromUrl(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateFromUrl(e.urlAfterRedirects));
  }

  private updateFromUrl(url: string): void {
    const lang: Lang = url === '/en' || url.startsWith('/en/') ? 'en' : 'pt';
    this.lang.set(lang);
    this.doc.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  }

  /** Prefixa um path interno (ex: '/sobre') com /en quando aplicável. */
  localize(path: string): string {
    return this.lang() === 'en' ? '/en' + path : path;
  }

  /** URL equivalente na outra língua, mantendo a mesma página. */
  switchedUrl(): string {
    const url = this.router.url;
    if (url === '/en' || url.startsWith('/en/')) {
      const stripped = url.replace(/^\/en/, '');
      return stripped || '/home';
    }
    return '/en' + (url.startsWith('/') ? url : '/' + url);
  }

  switchLang(): void {
    this.router.navigateByUrl(this.switchedUrl());
  }
}
