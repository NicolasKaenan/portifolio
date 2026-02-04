import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'home',
    renderMode: RenderMode.Server,
  },
  {
    path: 'sobre',
    renderMode: RenderMode.Server,
  },
  {
    path: 'projetos',
    renderMode: RenderMode.Server,
  },
  {
    path: 'certificados',
    renderMode: RenderMode.Server,
  },
  {
    path: 'control',
    renderMode: RenderMode.Server,
  },
  {
    path: 'projeto/:id',
    renderMode: RenderMode.Server,
  },
];
