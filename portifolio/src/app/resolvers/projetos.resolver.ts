import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { ProjectsService } from '../core/services/projects.service';
import { Project } from '../core/models/projects.model';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ProjetosResolver implements Resolve<Project[]> {

  constructor(
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  resolve() {
    if (isPlatformServer(this.platformId)) {
      return of([]);
    }

    return this.projectsService.getAll();
  }
}

