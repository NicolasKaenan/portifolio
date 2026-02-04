import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-menu-portifolio',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-portifolio.html',
  styleUrls: ['./menu-portifolio.css'],
})
export class MenuPortifolioComponent implements AfterViewInit {
  menuOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const target = document.getElementById('typed');
    if (!target) return;

    new Typewriter(target, {
      loop: true,
      delay: 70,
    })
    .typeString('Desenvolvedor Web')
    .pauseFor(350)
    .deleteAll()
    .typeString('Programação • Arquitetura • Código limpo')
    .pauseFor(400)
    .deleteAll()
    .typeString('Segurança Ofensiva')
    .pauseFor(400)
    .deleteAll()
    .typeString('Pentest Web • Exploração • OWASP')
    .pauseFor(400)
    .deleteAll()
    .typeString('Ataco aplicações')
    .pauseFor(350)
    .typeString(' para torná-las mais seguras')
    .pauseFor(1000)
    .start();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
