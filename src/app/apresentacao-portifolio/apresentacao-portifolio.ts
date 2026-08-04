import {
  Component,
  AfterViewInit,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { LanguageService } from '../core/i18n/language.service';

interface TermLine {
  html: string;
  pause: number;
}

const LINES_PT: TermLine[] = [
  { html: '<span class="prompt">$</span> whoami', pause: 350 },
  { html: 'kaenan &#8212; AppSec / Pentest / Full-stack', pause: 400 },
  { html: '<span class="prompt">$</span> nmap -sV -p- <span class="path">10.10.11.42</span>', pause: 400 },
  { html: 'Iniciando varredura... 5 hosts descobertos em 4m12s', pause: 300 },
  { html: '<span class="ok">[+]</span> Serviço identificado: nginx 1.18 / porta 443', pause: 350 },
  { html: '<span class="crit">[!] IDOR confirmado</span> em /api/v1/user/{id}', pause: 450 },
  { html: 'Gerando relatório técnico com prova de conceito...', pause: 300 },
  { html: '<span class="ok">[✓]</span> Pronto para revisão', pause: 0 },
];

const LINES_EN: TermLine[] = [
  { html: '<span class="prompt">$</span> whoami', pause: 350 },
  { html: 'kaenan &#8212; AppSec / Pentest / Full-stack', pause: 400 },
  { html: '<span class="prompt">$</span> nmap -sV -p- <span class="path">10.10.11.42</span>', pause: 400 },
  { html: 'Starting scan... 5 hosts discovered in 4m12s', pause: 300 },
  { html: '<span class="ok">[+]</span> Service identified: nginx 1.18 / port 443', pause: 350 },
  { html: '<span class="crit">[!] IDOR confirmed</span> on /api/v1/user/{id}', pause: 450 },
  { html: 'Generating technical report with proof of concept...', pause: 300 },
  { html: '<span class="ok">[✓]</span> Ready for review', pause: 0 },
];

@Component({
  selector: 'apresentacao-portifolio',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './apresentacao-portifolio.html',
  styleUrl: './apresentacao-portifolio.css',
})
export class ApresentacaoPortifolio implements AfterViewInit {
  @ViewChild('termBody') termBody?: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public languageService: LanguageService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.typeLine(0), 350);
  }

  private get lines(): TermLine[] {
    return this.languageService.lang() === 'en' ? LINES_EN : LINES_PT;
  }

  private typeLine(i: number): void {
    const body = this.termBody?.nativeElement;
    if (!body) return;

    if (i >= this.lines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      body.appendChild(cursor);
      return;
    }

    const div = document.createElement('div');
    div.className = 'term-line';
    div.style.opacity = '0';
    div.innerHTML = this.lines[i].html;
    body.appendChild(div);

    requestAnimationFrame(() => {
      div.style.transition = 'opacity .25s ease';
      div.style.opacity = '1';
    });

    setTimeout(() => this.typeLine(i + 1), this.lines[i].pause + 260);
  }
}
