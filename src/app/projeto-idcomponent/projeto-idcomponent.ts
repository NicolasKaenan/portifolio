import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '../core/models/projects.model';
import { ProjectsService } from '../core/services/projects.service';
import { MarkdownModule } from 'ngx-markdown';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { LanguageService } from '../core/i18n/language.service';
import { extractLang } from '../core/i18n/multilang';
import { SeoService } from '../core/i18n/seo.service';

@Component({
  selector: 'app-projeto-idcomponent',
  standalone: true,
  imports: [RouterModule, MarkdownModule, TranslatePipe],
  templateUrl: './projeto-idcomponent.html',
  styleUrls: ['./projeto-idcomponent.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetoIDComponent implements OnInit, OnDestroy {

  project = signal<Project | null>(null);
  loading = signal(true);
  error = signal(false);

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    public languageService: LanguageService,
    private seo: SeoService
  ) {}

  text(raw: string): string {
    return extractLang(raw, this.languageService.lang());
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('id'));

        this.loading.set(true);
        this.error.set(false);

        this.projectsService.getById(id).subscribe({
          next: (data) => {
            this.project.set(data);
            this.loading.set(false);

            const lang = this.languageService.lang();
            const title = extractLang(data.title, lang);
            const description = extractLang(data.shortened_description, lang);
            this.seo.set({
              title: `${title} — Nicolas Kaenan Silveira`,
              description,
              path: `/projeto/${id}`,
              lang,
            });
          },
          error: (err) => {
            console.error(err);
            this.error.set(true);
            this.loading.set(false);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
