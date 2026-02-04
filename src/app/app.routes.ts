import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { SobreComponent } from './sobre-component/sobre-component';
import { ProjetoComponent } from './projeto-component/projeto-component';
import { CertificadoComponent } from './certificado-component/certificado-component';
import { LoginCmsComponent } from './login-cms-component/login-cms-component';
import { PainelCmsComponent } from './painel-cms-component/painel-cms-component';
import { ProjetosResolver } from './resolvers/projetos.resolver';
import { ProjetoIDComponent } from '../projeto-idcomponent/projeto-idcomponent';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  {
  path: 'projetos',
  loadComponent: () => import('./projeto-component/projeto-component')
    .then(m => m.ProjetoComponent),
  resolve: {
    projetos: ProjetosResolver
  }
  }
  ,{
    path: 'projeto/:id',
    loadComponent: () =>
      import('./projeto-component/projeto-component').then(m => m.ProjetoComponent),
  }
,
  { path: 'certificados', component: CertificadoComponent },
  {
    path: 'control',
    children: [
      { path: 'login', component: LoginCmsComponent },
      { path: 'painel', component: PainelCmsComponent },
    ],
  },
];
