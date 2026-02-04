import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Project } from '../core/models/projects.model';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../core/services/projects.service';

@Component({
  selector: 'app-projeto-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projeto-component.html',
  styleUrl: './projeto-component.css'
})
export class ProjetoComponent implements OnInit {

  projects: Project[] = [];
  loading = true;
  error = false;

  constructor(
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.projectsService.getAll().subscribe({
        next: (data) => {
          this.projects = data;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
