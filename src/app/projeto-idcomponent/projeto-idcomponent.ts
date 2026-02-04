import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '../core/models/projects.model';
import { ProjectsService } from '../core/services/projects.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projeto-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './projeto-idcomponent.html',
  styleUrls: ['./projeto-idcomponent.css']
})
export class ProjetoIDComponent implements OnInit, OnDestroy {

  project!: Project;
  loading = true;
  error = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('id'));

        this.loading = true;
        this.error = false;

        if (isPlatformBrowser(this.platformId)) {
          this.projectsService.getById(id).subscribe({
            next: (data) => {
              this.project = data;
              this.loading = false;
            },
            error: (err) => {
              console.error(err);
              this.error = true;
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
