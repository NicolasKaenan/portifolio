import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostTag } from '../models/post-tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly apiUrl = 'https://api.kaenan.dev/api/v1/tags';

  constructor(private http: HttpClient) {}

  addToProject(projectId: number, value: string) {
    return this.http.post<PostTag>(`${this.apiUrl}/projects/${projectId}`, { value });
  }

  delete(tagId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`);
  }
}
