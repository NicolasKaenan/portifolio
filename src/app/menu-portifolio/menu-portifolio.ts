import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NgxTypedWriterModule } from 'ngx-typed-writer';

@Component({
  selector: 'menu-portifolio',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxTypedWriterModule],
  templateUrl: './menu-portifolio.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./menu-portifolio.css']
})
export class MenuPortifolio {
  constructor(private router: Router) {}
  toggleMenu() {
    const menu = document.querySelector('.menu-portifolio');
    const menu_nav = document.querySelector('.menu-portifolio-nav');
    if (menu) {
      menu.classList.toggle('open');
      if (menu_nav) {
        menu_nav.classList.toggle('open');
      }
    }
  }
}
