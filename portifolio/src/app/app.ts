import { Component } from '@angular/core';

import { FooterPortifolio } from "./footer-portifolio/footer-portifolio";
import { MenuPortifolioComponent } from './menu-portifolio/menu-portifolio';
import { RouterOutlet } from '@angular/router';
import { TerminalDrawerComponent } from './terminal-drawer/terminal-drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuPortifolioComponent, FooterPortifolio, TerminalDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend_kaenan';
}
