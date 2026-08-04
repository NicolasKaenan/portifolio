import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { SobreComponent } from './sobre-component/sobre-component';
import { CertificadoComponent } from './certificado-component/certificado-component';
import { LoginCmsComponent } from './login-cms-component/login-cms-component';
import { PainelCmsComponent } from './painel-cms-component/painel-cms-component';
import { authGuard } from './core/guards/auth.guard';

// Rotas de conteúdo público, compartilhadas entre PT (raiz) e EN (prefixo /en).
// Mesmos componentes nos dois casos: o LanguageService decide o idioma
// olhando o prefixo da URL atual.
const contentRoutes: Routes = [
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
];

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'en', redirectTo: '/en/home', pathMatch: 'full' },

  ...contentRoutes,
  { path: 'en', children: contentRoutes },

  {
    path: 'control',
    children: [
      { path: 'login', component: LoginCmsComponent },
      { path: 'painel', component: PainelCmsComponent, canActivate: [authGuard] },
    ],
  },
];
