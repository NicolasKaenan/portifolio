import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'menu-portifolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-portifolio.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./menu-portifolio.css']
})
export class MenuPortifolio {
  constructor(private router: Router) {}

  
}
