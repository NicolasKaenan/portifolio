import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const SITE_URL = 'https://kaenan.dev';
const API_URL = 'https://api.kaenan.dev/api/v1/projects';

/**
 * Sitemap dinâmico: inclui as páginas estáticas (PT + EN) e também uma
 * entrada por projeto, buscando a lista ao vivo da API. Se a API falhar,
 * cai de volta pras páginas estáticas só, sem quebrar a resposta.
 */
app.get('/sitemap.xml', async (req, res) => {
  const staticPaths = ['/home', '/sobre', '/projetos', '/certificados'];

  let projectIds: number[] = [];
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const projects = (await response.json()) as Array<{ id: number }>;
      projectIds = projects.map((p) => p.id);
    }
  } catch {
    // sitemap ainda funciona só com as páginas estáticas
  }

  const urlEntry = (path: string) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}${path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en${path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}"/>
  </url>
  <url>
    <loc>${SITE_URL}/en${path}</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}${path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en${path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}"/>
  </url>`;

  const allPaths = [...staticPaths, ...projectIds.map((id) => `/projeto/${id}`)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${allPaths.map(urlEntry).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
