import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { ProjectsService } from '../core/services/projects.service';
import { CertificatesService } from '../core/services/certificates.service';
import { TagsService } from '../core/services/tags.service';

import { Project } from '../core/models/projects.model';
import { Certificate } from '../core/models/certificate.model';

type Tab = 'projetos' | 'certificados';

interface ProjectForm {
  title: string;
  shortened_description: string;
  full_description: string;
  project_url: string;
  repository_url: string;
  posting_date: string;
}

interface CertificateForm {
  title: string;
  institution: string;
  shortenedDescription: string;
  fullDescription: string;
  completionDate: string;
  linkValidation: string;
}

const EMPTY_PROJECT: ProjectForm = {
  title: '',
  shortened_description: '',
  full_description: '',
  project_url: '',
  repository_url: '',
  posting_date: '',
};

const EMPTY_CERTIFICATE: CertificateForm = {
  title: '',
  institution: '',
  shortenedDescription: '',
  fullDescription: '',
  completionDate: '',
  linkValidation: '',
};

@Component({
  selector: 'app-painel-cms-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painel-cms-component.html',
  styleUrl: './painel-cms-component.css'
})
export class PainelCmsComponent implements OnInit {
  tab = signal<Tab>('projetos');

  projects = signal<Project[]>([]);
  certificates = signal<Certificate[]>([]);
  loading = signal(true);
  saving = signal(false);
  formError = signal<string | null>(null);

  editingProjectId = signal<number | null>(null);
  editingCertificateId = signal<number | null>(null);

  projectForm: ProjectForm = { ...EMPTY_PROJECT };
  certificateForm: CertificateForm = { ...EMPTY_CERTIFICATE };

  newTagValue: Record<number, string> = {};

  constructor(
    private auth: AuthService,
    private projectsService: ProjectsService,
    private certificatesService: CertificatesService,
    private tagsService: TagsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  reloadAll(): void {
    this.loading.set(true);
    this.projectsService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.certificatesService.getAll().subscribe({
      next: (data) => this.certificates.set(data),
      error: () => {},
    });
  }

  setTab(t: Tab): void {
    this.tab.set(t);
    this.formError.set(null);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/control/login']);
  }

  // ---------- Projetos ----------

  startNewProject(): void {
    this.editingProjectId.set(null);
    this.projectForm = { ...EMPTY_PROJECT };
    this.formError.set(null);
  }

  startEditProject(p: Project): void {
    this.editingProjectId.set(p.id);
    this.projectForm = {
      title: p.title,
      shortened_description: p.shortened_description,
      full_description: p.full_description,
      project_url: p.project_url,
      repository_url: p.repository_url,
      posting_date: (p.posting_date || '').slice(0, 10),
    };
    this.formError.set(null);
  }

  saveProject(): void {
    this.saving.set(true);
    this.formError.set(null);
    const id = this.editingProjectId();

    const request = id
      ? this.projectsService.update(id, this.projectForm)
      : this.projectsService.create(this.projectForm);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.startNewProject();
        this.reloadAll();
      },
      error: () => {
        this.saving.set(false);
        this.formError.set('Não consegui salvar o projeto. Confira os campos.');
      },
    });
  }

  deleteProject(p: Project): void {
    if (!confirm(`Excluir o projeto "${p.title}"? Essa ação não pode ser desfeita.`)) return;

    this.projectsService.delete(p.id).subscribe({
      next: () => this.reloadAll(),
      error: () => this.formError.set('Não consegui excluir esse projeto.'),
    });
  }

  addTag(project: Project): void {
    const value = (this.newTagValue[project.id] || '').trim();
    if (!value) return;

    this.tagsService.addToProject(project.id, value).subscribe({
      next: () => {
        this.newTagValue[project.id] = '';
        this.reloadAll();
      },
      error: () => this.formError.set('Não consegui adicionar essa tag (talvez já exista).'),
    });
  }

  removeTag(tagId: number): void {
    this.tagsService.delete(tagId).subscribe({
      next: () => this.reloadAll(),
      error: () => this.formError.set('Não consegui remover essa tag.'),
    });
  }

  // ---------- Certificados ----------

  startNewCertificate(): void {
    this.editingCertificateId.set(null);
    this.certificateForm = { ...EMPTY_CERTIFICATE };
    this.formError.set(null);
  }

  startEditCertificate(c: Certificate): void {
    this.editingCertificateId.set(c.id);
    this.certificateForm = {
      title: c.title,
      institution: c.institution,
      shortenedDescription: c.shortenedDescription,
      fullDescription: c.fullDescription,
      completionDate: (c.completionDate || '').slice(0, 10),
      linkValidation: c.linkValidation,
    };
    this.formError.set(null);
  }

  saveCertificate(): void {
    this.saving.set(true);
    this.formError.set(null);
    const id = this.editingCertificateId();

    const request = id
      ? this.certificatesService.update(id, this.certificateForm)
      : this.certificatesService.create(this.certificateForm);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.startNewCertificate();
        this.reloadAll();
      },
      error: () => {
        this.saving.set(false);
        this.formError.set('Não consegui salvar o certificado. Confira os campos (o link de validação precisa ser único).');
      },
    });
  }

  deleteCertificate(c: Certificate): void {
    if (!confirm(`Excluir o certificado "${c.title}"? Essa ação não pode ser desfeita.`)) return;

    this.certificatesService.delete(c.id).subscribe({
      next: () => this.reloadAll(),
      error: () => this.formError.set('Não consegui excluir esse certificado.'),
    });
  }
}
