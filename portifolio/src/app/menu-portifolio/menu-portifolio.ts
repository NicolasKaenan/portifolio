import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-menu-portifolio',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
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
      delay: 55,
    })
      .typeString('Desenvolvedor Full-stack')
      .pauseFor(500)
      .deleteAll()
      .typeString('Pentester / AppSec')
      .pauseFor(500)
      .deleteAll()
      .typeString('Ataco aplicações')
      .pauseFor(300)
      .typeString(' para torná-las mais seguras')
      .pauseFor(1200)
      .start();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
