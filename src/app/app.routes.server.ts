import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projeto/:id',
    renderMode: RenderMode.Server,
  },
];
