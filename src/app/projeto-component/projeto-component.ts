import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../core/models/projects.model';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../core/services/projects.service';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { LanguageService } from '../core/i18n/language.service';
import { extractLang } from '../core/i18n/multilang';
import { SeoService } from '../core/i18n/seo.service';
import { translate } from '../core/i18n/translations';

@Component({
  selector: 'app-projeto-component',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './projeto-component.html',
  styleUrl: './projeto-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetoComponent implements OnInit {

  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(
    private projectsService: ProjectsService,
    public languageService: LanguageService,
    private seo: SeoService
  ) {}

  ngOnInit() {
    const lang = this.languageService.lang();
    this.seo.set({
      title: translate('seo.projetos.title', lang),
      description: translate('seo.projetos.description', lang),
      path: '/projetos',
      lang,
    });

    this.projectsService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  text(raw: string): string {
    return extractLang(raw, this.languageService.lang());
  }
}
