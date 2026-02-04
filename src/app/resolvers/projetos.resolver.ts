import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectsService } from '../core/services/projects.service';
import { Project } from '../core/models/projects.model';

@Injectable({ providedIn: 'root' })
export class ProjetosResolver implements Resolve<Project[]> {

  constructor(private service: ProjectsService) {}

  resolve() {
    return this.service.getAll().pipe(
      catchError(err => {
        console.error('Erro no resolver:', err);
        return of([]);
      })
    );
  }
}
