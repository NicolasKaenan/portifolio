import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Project } from "../models/projects.model";

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  private readonly apiUrl = 'https://api.kaenan.dev/api/v1/projects';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }
}
