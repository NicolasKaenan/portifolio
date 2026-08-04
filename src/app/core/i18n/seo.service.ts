import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Lang } from './multilang';

export interface SeoData {
  title: string;
  description: string;
  /** Path sem prefixo de idioma, ex: '/sobre', '/projeto/12'. */
  path: string;
  lang: Lang;
  image?: string;
}

const SITE_URL = 'https://kaenan.dev';
const DEFAULT_IMAGE = `${SITE_URL}/kaenan.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  set(data: SeoData): void {
    const { title, description, path, lang, image } = data;
    const ptUrl = `${SITE_URL}${path}`;
    const enUrl = `${SITE_URL}/en${path}`;
    const currentUrl = lang === 'en' ? enUrl : ptUrl;
    const ogImage = image || DEFAULT_IMAGE;

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'en' ? 'en_US' : 'pt_BR' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Nicolas Kaenan Silveira' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    this.setLink('canonical', currentUrl);
    this.setLink('alternate', ptUrl, 'pt-BR');
    this.setLink('alternate', enUrl, 'en');
    this.setLink('alternate', ptUrl, 'x-default');
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;

    let el = this.doc.head.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }
}
