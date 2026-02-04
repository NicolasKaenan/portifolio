import { Component } from '@angular/core';

import { SobreComponent } from './sobre-component/sobre-component';
import { ProjetoComponent } from './projeto-component/projeto-component';
import { CertificadoComponent } from './certificado-component/certificado-component';
import { FooterPortifolio } from "./footer-portifolio/footer-portifolio";
import { MenuPortifolioComponent } from './menu-portifolio/menu-portifolio';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home-component/home-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuPortifolioComponent, HomeComponent, SobreComponent, ProjetoComponent, CertificadoComponent, FooterPortifolio],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend_kaenan';
}
