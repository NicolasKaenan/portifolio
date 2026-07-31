import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Project } from '../core/models/projects.model';
import { ProjectsService } from '../core/services/projects.service';

const CERTIFICATE_TAG = 'certificado';

@Component({
  selector: 'app-certificado-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificado-component.html',
  styleUrl: './certificado-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CertificadoComponent implements OnInit {
  certificates: Project[] = [];
  loading = true;
  error = false;

  constructor(
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading = false;
      return;
    }

    this.projectsService.getAll().subscribe({
      next: (data) => {
        this.certificates = data.filter((p) =>
          p.postTags?.some((tag) => tag.name?.toLowerCase() === CERTIFICATE_TAG)
        );
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
