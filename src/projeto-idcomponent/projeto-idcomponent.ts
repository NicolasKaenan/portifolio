import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '../app/core/models/projects.model';
import { ProjectsService } from '../app/core/services/projects.service';


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
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('id'));

        this.loading = true;
        this.error = false;

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
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
