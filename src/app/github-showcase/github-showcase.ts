import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { GithubService, GithubRepo } from '../core/services/github.service';
import { TranslatePipe } from '../core/i18n/translate.pipe';

@Component({
  selector: 'app-github-showcase',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './github-showcase.html',
  styleUrl: './github-showcase.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GithubShowcaseComponent implements OnInit {
  repos = signal<GithubRepo[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getFeaturedRepos(6).subscribe({
      next: (repos) => {
        this.repos.set(repos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
