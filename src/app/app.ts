import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuPortifolio } from "./menu-portifolio/menu-portifolio";
import { HomeComponent } from './home-component/home-component';
import { SobreComponent } from './sobre-component/sobre-component';
import { ProjetoComponent } from './projeto-component/projeto-component';
import { CertificadoComponent } from './certificado-component/certificado-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuPortifolio, HomeComponent, SobreComponent, ProjetoComponent, CertificadoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend_kaenan';
}
