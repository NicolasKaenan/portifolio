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
import { combineLang, splitLang } from '../core/i18n/multilang';

type Tab = 'projetos' | 'certificados';

interface ProjectForm {
  title_pt: string;
  title_en: string;
  shortened_pt: string;
  shortened_en: string;
  full_pt: string;
  full_en: string;
  project_url: string;
  repository_url: string;
  posting_date: string;
}

interface CertificateForm {
  title_pt: string;
  title_en: string;
  institution_pt: string;
  institution_en: string;
  shortened_pt: string;
  shortened_en: string;
  full_pt: string;
  full_en: string;
  completionDate: string;
  linkValidation: string;
}

const EMPTY_PROJECT: ProjectForm = {
  title_pt: '', title_en: '',
  shortened_pt: '', shortened_en: '',
  full_pt: '', full_en: '',
  project_url: '',
  repository_url: '',
  posting_date: '',
};

const EMPTY_CERTIFICATE: CertificateForm = {
  title_pt: '', title_en: '',
  institution_pt: '', institution_en: '',
  shortened_pt: '', shortened_en: '',
  full_pt: '', full_en: '',
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
    const title = splitLang(p.title);
    const shortened = splitLang(p.shortened_description);
    const full = splitLang(p.full_description);

    this.projectForm = {
      title_pt: title.pt, title_en: title.en,
      shortened_pt: shortened.pt, shortened_en: shortened.en,
      full_pt: full.pt, full_en: full.en,
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
    const f = this.projectForm;

    const payload = {
      title: combineLang(f.title_pt, f.title_en),
      shortened_description: combineLang(f.shortened_pt, f.shortened_en),
      full_description: combineLang(f.full_pt, f.full_en),
      project_url: f.project_url,
      repository_url: f.repository_url,
      posting_date: f.posting_date,
    };

    const request = id
      ? this.projectsService.update(id, payload)
      : this.projectsService.create(payload);

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

  /** Mostra só a parte em PT nas listas do painel, mesmo se o campo tiver as tags [[lang:..]]. */
  preview(raw: string): string {
    return splitLang(raw).pt || raw || '';
  }

  // ---------- Certificados ----------

  startNewCertificate(): void {
    this.editingCertificateId.set(null);
    this.certificateForm = { ...EMPTY_CERTIFICATE };
    this.formError.set(null);
  }

  startEditCertificate(c: Certificate): void {
    this.editingCertificateId.set(c.id);
    const title = splitLang(c.title);
    const institution = splitLang(c.institution);
    const shortened = splitLang(c.shortenedDescription);
    const full = splitLang(c.fullDescription);

    this.certificateForm = {
      title_pt: title.pt, title_en: title.en,
      institution_pt: institution.pt, institution_en: institution.en,
      shortened_pt: shortened.pt, shortened_en: shortened.en,
      full_pt: full.pt, full_en: full.en,
      completionDate: (c.completionDate || '').slice(0, 10),
      linkValidation: c.linkValidation,
    };
    this.formError.set(null);
  }

  saveCertificate(): void {
    this.saving.set(true);
    this.formError.set(null);
    const id = this.editingCertificateId();
    const f = this.certificateForm;

    const payload = {
      title: combineLang(f.title_pt, f.title_en),
      institution: combineLang(f.institution_pt, f.institution_en),
      shortenedDescription: combineLang(f.shortened_pt, f.shortened_en),
      fullDescription: combineLang(f.full_pt, f.full_en),
      completionDate: f.completionDate,
      linkValidation: f.linkValidation,
    };

    const request = id
      ? this.certificatesService.update(id, payload)
      : this.certificatesService.create(payload);

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
