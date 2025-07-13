import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { SobreComponent } from './sobre-component/sobre-component';
import { ProjetoComponent } from './projeto-component/projeto-component';
import { CertificadoComponent } from './certificado-component/certificado-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'projeto', component: ProjetoComponent },
  { path: 'certificados', component: CertificadoComponent }
];
