import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'home', renderMode: RenderMode.Server },
  { path: 'sobre', renderMode: RenderMode.Server },
  { path: 'projetos', renderMode: RenderMode.Server },
  { path: 'certificados', renderMode: RenderMode.Server },
  { path: 'projeto/:id', renderMode: RenderMode.Server },

  { path: 'en', renderMode: RenderMode.Server },
  { path: 'en/home', renderMode: RenderMode.Server },
  { path: 'en/sobre', renderMode: RenderMode.Server },
  { path: 'en/projetos', renderMode: RenderMode.Server },
  { path: 'en/certificados', renderMode: RenderMode.Server },
  { path: 'en/projeto/:id', renderMode: RenderMode.Server },

  { path: 'control/**', renderMode: RenderMode.Server },
];
