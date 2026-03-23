import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import 'zone.js';
import { MarkdownService, SANITIZE } from 'ngx-markdown';
import { SecurityContext } from '@angular/core';


bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    MarkdownService,
    { provide: SANITIZE, useValue: SecurityContext.HTML}
  ]
});

