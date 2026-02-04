import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../core/models/projects.model';
import { ProjectsService } from '../core/services/projects.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

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

  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
  this.route.data.subscribe(data => {
    this.projects = data['projetos'];
    this.loading = false;
  });
  }

}
