import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { SobreComponent } from './sobre-component/sobre-component';
import { CertificadoComponent } from './certificado-component/certificado-component';
import { LoginCmsComponent } from './login-cms-component/login-cms-component';
import { PainelCmsComponent } from './painel-cms-component/painel-cms-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'certificados', component: CertificadoComponent },

  {
    path: 'projetos',
    loadComponent: () =>
      import('./projeto-component/projeto-component')
        .then(m => m.ProjetoComponent),
  },
  {
    path: 'projeto/:id',
    loadComponent: () =>
      import('./projeto-idcomponent/projeto-idcomponent')
        .then(m => m.ProjetoIDComponent),
  },

  {
    path: 'control',
    children: [
      { path: 'login', component: LoginCmsComponent },
      { path: 'painel', component: PainelCmsComponent },
    ],
  },
];
