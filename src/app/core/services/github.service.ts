import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
}

const GITHUB_USER = 'NicolasKaenan';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly apiUrl = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`;

  constructor(private http: HttpClient) {}

  getFeaturedRepos(limit = 6) {
    return this.http.get<GithubRepo[]>(this.apiUrl).pipe(
      map((repos) =>
        repos
          .filter((r) => !r.fork && r.name.toLowerCase() !== GITHUB_USER.toLowerCase())
          .slice(0, limit)
      )
    );
  }
}
